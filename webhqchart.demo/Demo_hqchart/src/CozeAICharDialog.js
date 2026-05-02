
class CozeAICharDialogV2
{
    UPLOAD_URL="https://api.coze.cn/v1/files/upload";
    CREATE_CONVERSATION_URL="https://api.coze.cn/v1/conversation/create";
    CHAT_URL="https://api.coze.cn/v3/chat";

    ConversationID=null;

    Title="HQChart AI助手";

    DivAIButton=null;
    DivDialog=null;
    DivMessageList=null;    //消息列表
    InputDOM=null;
    DivSendButton=null;

    GetHQChartDataCallback=null;

    KLineAnalyzeConfig={ Prompt:"分析文件，并总结近半年的走势", Text:"读取K线图,并且分析下这个股票近半年的走势" };
    MinuteAnalyzeConfig={ Prompt:"分析文件，总结这个股票",  Text:"分析下这个股票" };

    Create()
    {
        // 悬浮球
        const floatBtn = document.createElement('div');
        floatBtn.className = 'HQChart_AI_Float_Button';
        floatBtn.textContent = 'AI';
       
        document.body.appendChild(floatBtn);

        //聊天盒子
        const chatBox = document.createElement('div');
        chatBox.className = 'HQChart_AI_Chat_Box';

        // 头部
        const header = document.createElement('div');
        header.className = 'HQChart_AI_Chat_Header';
        header.innerHTML = `<span>${this.Title}</span><span class="HQChart_AI_Close_Button">×</span>`;

        // 消息列表
        const msgList = document.createElement('div');
        msgList.className = 'HQChart_AI_Message_List';
        

        // 输入区域
        const inputArea = document.createElement('div');
        inputArea.className = 'HQChart_AI_Input_Area';
        inputArea.innerHTML = `
            <!--
            <button class="HQChart_AI_Upload_Button">
                <i class="hqchart_drawtool icon-attachment"></i>
            </button>
            --!>
            <button class="HQChart_AI_Upload_Button HQChart_AI_Minute_Analyze" id="Minute_Analyze">
                <i class="hqchart_drawtool icon-zoushitu"></i>
            </button>
            <button class="HQChart_AI_Upload_Button HQChart_AI_KLine_Analyze" id="KLine_Analyze">
                <i class="hqchart_drawtool icon-kxiantu"></i>
            </button>
            <input type="file" id="HQChart_AI_File_Input" style="display:none" multiple accept="*">
            <input type="text" class="HQChart_AI_input" placeholder="输入消息...">
            <button class="HQChart_AI_Send-Button">发送</button>
        `;

        // 组装
        chatBox.append(header, msgList, inputArea);
        document.body.appendChild(chatBox);

        // 元素获取
        const closeBtn = header.querySelector('.HQChart_AI_Close_Button');
        const uploadBtn = inputArea.querySelector('.HQChart_AI_Upload_Button');
        const fileInput = inputArea.querySelector('#AI_File_Input');
        const input = inputArea.querySelector('.HQChart_AI_input');
        const sendBtn = inputArea.querySelector('.HQChart_AI_Send-Button');
        const klineAnalyzeBtn= inputArea.querySelector('#KLine_Analyze');
        const minuteAnalyzeBtn=inputArea.querySelector('#Minute_Analyze');

        this.DivAIButton=floatBtn;
        this.DivMessageList=msgList;
        this.InputDOM=input;
        this.DivDialog=chatBox;
        this.DivSendButton=sendBtn;

        // 3. 交互逻辑
        this.DivAIButton.onclick = () => { this.Show(); }
        this.DivSendButton.onclick=(e)=>{ this.OnClickSend() }
        header.onmousedown=(e)=>{ this.OnMouseDownTitle(e); }
        closeBtn.onclick = () => { this.Close(); }
        //uploadBtn.onclick = () => fileInput.click();

        klineAnalyzeBtn.onclick=(e)=>{ this.OnClinKLineAnalyze() };
        minuteAnalyzeBtn.onclick=(e)=>{ this.OnClinMinuteAnalyze() };
    }

    Close()
    {
        if (!this.DivDialog) return;
        this.DivDialog.style.display = 'none';
    }

    Show(x,y)
    {
        if (!this.DivDialog) return;
        this.DivDialog.style.display = 'flex';
    }

    AddMessage(text, role, imgUrl = null)
    {
        const div = document.createElement('div');
        div.className = `HQChart_AI_Message_Item ${role === 'user' ? 'HQChart_AI_User_Message_Item' : 'HQChart_AI_AI_Message_Item'}`;

        if (imgUrl) 
        {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = 'ai-image-preview';
            div.append(text, '\n', img);
        } 
        else 
        {
            div.textContent = text;
        }

        this.DivMessageList.appendChild(div);
        this.DivMessageList.scrollTop = this.DivMessageList.scrollHeight;
    }

    RemoveThinking(cache)
    {
        if (!cache || !cache.DivThinking) return;
        cache.DivThinking.remove();
        cache.DivThinking=null;
    }

    ShowThinking(cache)
    {
        var thinkingEl = document.createElement('div');
        thinkingEl.className = 'HQChart_AI_Thinking';
        thinkingEl.innerHTML = `思考中<span class="HQChart_AI_Thinking_Dot"></span><span class="HQChart_AI_Thinking_Dot"></span><span class="HQChart_AI_Thinking_Dot"></span>`;
        this.DivMessageList.appendChild(thinkingEl);
        this.DivMessageList.scrollTop = this.DivMessageList.scrollHeight;
        cache.DivThinking=thinkingEl;
    }

    OnMouseDownTitle(e)
    {
        if (!this.DivDialog) return;

        var dragData={ X:e.clientX, Y:e.clientY };
        dragData.YOffset=e.clientX - this.DivDialog.offsetLeft;
        dragData.XOffset=e.clientY - this.DivDialog.offsetTop;
        this.DragTitle=dragData;

        document.onmousemove=(e)=>{ this.DocOnMouseMoveTitle(e); }
        document.onmouseup=(e)=>{ this.DocOnMouseUpTitle(e); }
    }

    DocOnMouseMoveTitle(e)
    {
        if (!this.DragTitle) return;

        var left = e.clientX - this.DragTitle.YOffset;
        var top = e.clientY - this.DragTitle.XOffset;

        var right=left+this.DivDialog.offsetWidth;
        var bottom=top+ this.DivDialog.offsetHeight;
        
        if ((right+5)>=window.innerWidth) left=window.innerWidth-this.DivDialog.offsetWidth-5;
        if ((bottom+5)>=window.innerHeight) top=window.innerHeight-this.DivDialog.offsetHeight-5;

        this.DivDialog.style.left = left + 'px';
        this.DivDialog.style.top = top + 'px';

        if(e.preventDefault) e.preventDefault();
    }

    DocOnMouseUpTitle(e)
    {
        this.DragTitle=null;
        document.onmousemove = null;
        document.onmouseup = null;
    }

    async OnClickSend()
    {
        if (!this.InputDOM) return;
        const text = this.InputDOM.value.trim();
        if (!text) return;

        this.InputDOM.value='';
        this.AddMessage(text, 'user');
        
        this.SendMessage(null, null, text);
    }

    CreateAIAnswerDiv()
    {
        const div = document.createElement('div');
        div.className = 'HQChart_AI_Message_Item HQChart_AI_AI_Message_Item';
        this.DivMessageList.appendChild(div);
        return div;
    }

    WriteAIAnswer(answer, bEnd, cache)
    {
        this.RemoveThinking(cache);

        if (!cache.DivAnswer) cache.DivAnswer=this.CreateAIAnswerDiv();

        cache.DivAnswer.innerText = answer;
        if (!bEnd) cache.DivAnswer.innerHTML += '<span class="HQChart_AI_Typing_cursor"></span>';
        this.DivMessageList.scrollTop = this.DivMessageList.scrollHeight;
    }

    async OnClinKLineAnalyze()
    {
        if (!this.GetHQChartDataCallback) return;

        var date=new Date();
        var endDate=date.getFullYear()*10000+(date.getMonth()+1)+date.getFullYear();
        date.setDate(date.setDate()-250); // 近1年
        var startDate=date.getFullYear()*10000+(date.getMonth()+1)+date.getFullYear();

        var data=this.GetHQChartDataCallback({ Type:"KLine", Start:{ Date:startDate}, End:{ Date:endDate } });
        if (!data) return;

        console.log("[OnClinKLineAnalyze] data=", data);
        var config=this.KLineAnalyzeConfig;

        // 设置文件名
        var content=data.Data;
        var fileName = `${data.Symbol} K线图数据.txt`;

        var text=`${data.Symbol}\n${config.Text}`;
        this.AddMessage(text, 'user');

        this.SendMessage(content, fileName, config.Prompt);
    }

    async OnClinMinuteAnalyze()
    {
        if (!this.GetHQChartDataCallback) return;

        var data=this.GetHQChartDataCallback({ Type:"Minute" });
        if (!data) return;

        console.log("[OnClinMinuteAnalyze] data=", data);
        var config=this.MinuteAnalyzeConfig;
        // 设置文件名
        var content=data.Data;
        var fileName = `${data.Symbol} 分时图数据.txt`;

        var text=`${data.Symbol}\n${config.Text}`;
        this.AddMessage(text, 'user');

        this.SendMessage(content, fileName, config.Prompt);
    }

    async SendMessage(content, fileName, prompt)
    {
        var token=this.GetToken();
        var botId=this.GetBotID();
        if (!token || !botId)
        {
            alert("没有配置扣子token,或botId");
            return;
        }

        var cache=this.CreateAnswerCache();
        try 
        {
            if (content && fileName)
            {
                // 步骤1：上传文件
                this.AddMessage(`上传文件'${fileName}`, 'user');
                var updateResult = await this.UploadFile(content, fileName);
                var fileId=updateResult.FileID;
            }
            
            // 步骤2：创建会话
            if (!this.ConversationId)
            {
                //this.AddStep('创建会话...', 'active');
                var createResult = await this.CreateConversation();
                this.ConversationId=createResult.ConversationID;
                // this.AddStep(`会话创建成功，ID:${this.ConversationId}`, 'done');
            }
            
            // 步骤3：发起流式对话
            var conversationId= this.ConversationId;
            var response = await this.StreamChat(conversationId, prompt, fileId);
            cache.Response=response;
            this.ShowThinking(cache);
           

            // 步骤4：读取流式结果
            //this.AddStep('AI分析中...', 'active');
            var answer = await this.ReadStream(cache);
            //this.AddStep('AI分析完成', 'done');
            
            // 显示最终结果
            if (answer) this.WriteAIAnswer(answer, true, cache);
            else this.WriteAIAnswer("AI未返回有效回答", true, cache);
        }
        catch (e) 
        {
            //this.SetStatus('错误: ' + e.message, true);
            console.error(e);
        } 
        finally 
        {
            this.RemoveThinking(cache);
        }
    }

    CreateAnswerCache()
    {
        var item={ ID:Guid(), DivAnswer:null, DivThinking:null, Response:null };
        return item;
    }
    
    ///////////////////////////////////////////////////////////////////////////////
    //
    //
    //上传文件
    async UploadFile(content, fileName) 
    {
        // 1. 把字符串转成 File 对象（关键！）
        const blob = new Blob([content], { type: "text/plain" });
        const file = new File([blob], fileName, { type: "text/plain" });

        // 2. 构建表单
        const formData = new FormData();
        formData.append("file", file);

        var token=this.GetToken();
        const response = await fetch(this.UPLOAD_URL, 
        {
            method: 'POST',
            headers: 
            {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        });

        var result = await response.json();

        if (result.code === 0) return { FileID:result.data.id };

        throw new Error('上传失败: ' + result.msg);
    }

    //创建会话
    async CreateConversation() 
    {
        var token=this.GetToken();
        var botId=this.GetBotID();

        const response = await fetch(this.CREATE_CONVERSATION_URL, 
        {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bot_id: botId })
        });

        var result = await response.json();
        if (result.code === 0) return { ConversationID:result.data.id } ;
        
        throw new Error('创建会话失败: ' + result.msg);
    }

    //流式对话 带文件
    async StreamChat(conversationId, prompt, fileId) 
    {
        var content, contentType;
        if (fileId) 
        {
            content = JSON.stringify(
            [
                { type: 'text', text: prompt },
                { type: 'file', file_id: fileId }
            ]);
            contentType = 'object_string';
        } 
        else 
        {
            content = prompt;
            contentType = 'text';
        }

        var token=this.GetToken();
        var botId=this.GetBotID();
        const response = await fetch(this.CHAT_URL, 
        {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },  
            body: JSON.stringify(
            {
                bot_id: botId,
                user_id: 'user_001',
                conversation_id: conversationId,
                stream: true,
                auto_save_history: true,
                additional_messages: 
                [
                    {
                        role: 'user',
                        content: content,
                        content_type: contentType
                    }
                ]
            })
        });

        if (!response.ok) 
        {
            throw new Error('[CozeAICharDialog::StreamChat] 请求失败: HTTP ' + response.status);
        }

        return response;
    }

    //读取SSE流，提取AI回答
    async ReadStream(cahce) 
    {
        var response=cahce.Response;
        var reader = response.body.getReader();
        var decoder = new TextDecoder('utf-8');
        var answer = '';
        var buffer = '';

        while (true) 
        {
            var { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // 按行解析SSE
            var lines = buffer.split('\n');
            buffer = lines.pop(); // 最后一行可能不完整，留着下次拼

            for (var i = 0; i < lines.length; i++) 
            {
                var line = lines[i].trim();
                if (!line || !line.startsWith('event:')) 
                {
                    // 检查是否是data行
                    if (line.startsWith('data:')) 
                    {
                        try 
                        {
                            var jsonStr = line.substring(5).trim();
                            var data = JSON.parse(jsonStr);

                            // 提取AI回答内容
                            if (data.type === 'answer' && data.content) 
                            {
                                answer += data.content;

                                // 实时更新显示
                                this.WriteAIAnswer(answer, false, cahce);
                            }
                        } 
                        catch (e) 
                        {
                            // JSON解析失败，忽略
                        }
                    }
                    continue;
                }

                // 读取event类型
                var eventType = line.substring(6).trim();

                // 如果是对话完成事件
                if (eventType === 'done') 
                {
                    return answer;
                }
            }
        }

        return answer;
    }


    GetToken()
    {
        var token=null;
        if (EnvironmentVariable.CozeAI) token=EnvironmentVariable.CozeAI.Token;

        return token;
    }

    GetBotID()
    {
        var botid=null;
        if (EnvironmentVariable.CozeAI) botid=EnvironmentVariable.CozeAI.BotID;

        return botid;
    }

}