
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

    KLineAnalyzeConfig=
    { 
        AryQuestion:
        [
            "总结这个股票近2个月的走势。",
            "总结这个股票近2个月的新闻。",
            "统计近半年十日均线上穿五日均线的日期。"
        ]
    };

    MinuteAnalyzeConfig=
    { 
        AryQuestion:
        [
            "分析下这个股票。",
            "这个股票今天上涨了吗?"
        ]
    };

    ScrollTextAnalyzeConfig=
    {
        AryQuestion:
        [
            "总结下新闻",
            "整理新闻,列出对股票市场可能产生负面的新闻."
        ]
    };

    SelfReportAnalyzeConfig=
    {
        AryQuestion:
        [
            "总结我的自选股",
            "统计下我的自选股表现最好的前三名和最差的三名。"
        ]
    }

    AryUploadFileCache=[];  //{ FildID:, FileName: }

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
        header.innerHTML = `
            <span>${this.Title}</span>
            <div class="HQChart_AI_Header-Buttons">
            <span class="HQChart_AI_Clear_Button" title="清空聊天">🗑</span>
            <span class="HQChart_AI_Close_Button">×</span>
            </div>
        `;

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
            <button class="HQChart_AI_Upload_Button HQChart_AI_SelfReport_Analyze" id="SelfReport_Analyze">
                <i class="hqchart_drawtool icon-bianji"></i>
            </button>
            <button class="HQChart_AI_Upload_Button HQChart_AI_ScrollText_Analyze" id="ScrollText_Analyze">
                <i class="hqchart_drawtool icon-w_xinwen"></i>
            </button>
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
        const clearBtn= header.querySelector('.HQChart_AI_Clear_Button');
        const uploadBtn = inputArea.querySelector('.HQChart_AI_Upload_Button');
        const fileInput = inputArea.querySelector('#AI_File_Input');
        const input = inputArea.querySelector('.HQChart_AI_input');
        const sendBtn = inputArea.querySelector('.HQChart_AI_Send-Button');
        const klineAnalyzeBtn= inputArea.querySelector('#KLine_Analyze');
        const minuteAnalyzeBtn=inputArea.querySelector('#Minute_Analyze');
        const scrollTextAnalyzeBtn=inputArea.querySelector('#ScrollText_Analyze');    //滚动新闻
        const selfReportAnalyzeBtn=inputArea.querySelector('#SelfReport_Analyze');
        this.DivAIButton=floatBtn;
        this.DivMessageList=msgList;
        this.InputDOM=input;
        this.DivDialog=chatBox;
        this.DivSendButton=sendBtn;

        // 3. 交互逻辑
        this.DivAIButton.onclick = () => { this.Show(); }
        this.DivSendButton.onclick=(e)=>{ this.OnClickSend() }
        this.InputDOM.addEventListener('keydown', e => e.key === 'Enter' && this.OnClickSend());

        header.onmousedown=(e)=>{ this.OnMouseDownTitle(e); }
        closeBtn.onclick = () => { this.Close(); }
        clearBtn.onclick=()=>{ this.ClearMessageList(); }
        //uploadBtn.onclick = () => fileInput.click();

        klineAnalyzeBtn.onclick=(e)=>{ this.OnClinKLineAnalyze() };
        minuteAnalyzeBtn.onclick=(e)=>{ this.OnClinkMinuteAnalyze() };
        scrollTextAnalyzeBtn.onclick=(e)=>{ this.OnClickScrollTextAnalyze(); }
        selfReportAnalyzeBtn.onclick=(e)=>{ this.OnClickSelfReportAnalyze(); }
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


    ClearMessageList()
    {
        this.DivMessageList.innerHTML="";
        this.AryUploadFileCache=[];
        this.ConversationID=null;
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
        
        this.SendMessage(text);
    }

    

    async OnClinKLineAnalyze()
    {
        if (!this.GetHQChartDataCallback) return;

        var data=this.GetHQChartDataCallback({ Type:"KLine" });
        if (!data) return;

        console.log("[OnClinKLineAnalyze] data=", data);
        var config=this.KLineAnalyzeConfig;

        // 设置文件名
        var content=data.Data;
        var date=new Date();
        var fileName = `${data.Symbol} K线图数据-${date.getHours()*1000000+date.getMinutes()*100+date.getSeconds()}.txt`;

        this.SendFileData(`上传【${data.Name} ${data.Symbol}】K线图`, content, fileName, config.AryQuestion);
    }

    async OnClinkMinuteAnalyze()
    {
        if (!this.GetHQChartDataCallback) return;

        var data=this.GetHQChartDataCallback({ Type:"Minute" });
        if (!data) return;

        console.log("[OnClinkMinuteAnalyze] data=", data);
        var config=this.MinuteAnalyzeConfig;
        // 设置文件名
        var content=data.Data;
        var date=new Date();
        var fileName = `${data.Symbol} 分时图数据-${date.getHours()*1000000+date.getMinutes()*100+date.getSeconds()}.txt`;

        this.SendFileData(`上传【${data.Name} ${data.Symbol}】分时图`, content, fileName, config.AryQuestion);
    }

    async OnClickScrollTextAnalyze()
    {
        if (!this.GetHQChartDataCallback) return;

        var data=this.GetHQChartDataCallback({ Type:"ScrollText" });
        if (!data) return;

        console.log("[OnClickScrollTextAnalyze] data=", data);
        var config=this.ScrollTextAnalyzeConfig;
        // 设置文件名
        var content=data.Data;
        var date=new Date();
        var fileName = `滚动新闻数据-${date.getHours()*1000000+date.getMinutes()*100+date.getSeconds()}.txt`;

        this.SendFileData(`上传滚动新闻数据`, content, fileName, config.AryQuestion);
    }

    async OnClickSelfReportAnalyze()
    {
        if (!this.GetHQChartDataCallback) return;
        var data=this.GetHQChartDataCallback({ Type:"SelfReport" });
        if (!data) return;

        console.log("[OnClickSelfReportAnalyze] data=", data);
        var config=this.SelfReportAnalyzeConfig;
        // 设置文件名
        var content=data.Data;
        var date=new Date();
        var fileName = `自选股列表数据-${date.getHours()*1000000+date.getMinutes()*100+date.getSeconds()}.txt`;
        this.SendFileData(`上传自选股列表数据`, content, fileName, config.AryQuestion);
    }

    async SendMessage(prompt, file)
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
            if (file && file.Content && file.Name)
            {
                //上传文件
                if (file.Message) this.AddMessage(`${file.Message}`, 'user');
                else this.AddMessage(`上传文件'${file.Name}`, 'user');
                var updateResult = await this.UploadFile(file.Content, file.Name);
                var fileId=updateResult.FileID;
                this.AryUploadFileCache.push({ FileID:fileId, FileName:file.Name }); //放入缓存 对话的时候用
            }
            
            //创建会话
            if (!this.ConversationID)
            {
                //this.AddStep('创建会话...', 'active');
                var createResult = await this.CreateConversation();
                this.ConversationID=createResult.ConversationID;
                // this.AddStep(`会话创建成功，ID:${this.ConversationId}`, 'done');
            }
            
            //发起流式对话
            var conversationId= this.ConversationID;
            var response = await this.StreamChat(conversationId, prompt);
            cache.Response=response;
            this.CreateAIAnswserDOM(cache);

            //读取流式结果
            //this.AddStep('AI分析中...', 'active');
            var answer = await this.ReadStream(cache);
            //this.AddStep('AI分析完成', 'done');
            
            // 显示最终结果
            if (answer) 
            {
                this.WriteAIAnswerMakedown(answer,cache);
                this.AryUploadFileCache=[];
            }
            else 
            {
                this.WriteAIAnswer("AI未返回有效回答", true, cache);
            }
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
        //DivAnswer=回答 DivThinking=思考 DivReasoning=推理
        var item={ ID:Guid(), DivAnswer:null, DivThinking:null, DivReasoning:null, Response:null };
        return item;
    }

    RemoveThinking(cache)
    {
        if (!cache || !cache.DivThinking) return;
        cache.DivThinking.remove();
        cache.DivThinking=null;
    }

    CreateAIAnswserDOM(cache)
    {
        const thinkingEl = document.createElement('div');
        thinkingEl.className = 'HQChart_AI_Thinking';
        thinkingEl.innerHTML = `思考中<span class="HQChart_AI_Thinking_Dot"></span><span class="HQChart_AI_Thinking_Dot"></span><span class="HQChart_AI_Thinking_Dot"></span>`;

        const reasoningEl = document.createElement('div');
        reasoningEl.className = 'HQChart_AI_Message_Item HQChart_AI_AI_Reasoning_Item';
        reasoningEl.style.display = 'none';

        const answerEl = document.createElement('div');
        answerEl.className = 'HQChart_AI_Message_Item HQChart_AI_AI_Message_Item';
        answerEl.style.display = 'none';
       
        this.DivMessageList.appendChild(reasoningEl);
        this.DivMessageList.appendChild(thinkingEl);
        this.DivMessageList.appendChild(answerEl);
        this.DivMessageList.scrollTop = this.DivMessageList.scrollHeight;
       
        cache.DivReasoning=reasoningEl;
        cache.DivThinking=thinkingEl;
        cache.DivAnswer=answerEl;
    }

    WriteAIAnswer(answer, bEnd, cache)
    {
        this.RemoveThinking(cache);
        if (!cache.DivAnswer) return;

        cache.DivAnswer.innerText = answer;
        cache.DivAnswer.style.display="block";
        if (!bEnd) cache.DivAnswer.innerHTML += '<span class="HQChart_AI_Typing_cursor"></span>';
        this.DivMessageList.scrollTop = this.DivMessageList.scrollHeight;
    }

    WriteAIAnswerMakedown(answer, cache)
    {
        this.RemoveThinking(cache);
        if (!cache.DivAnswer) return;
        
        const rawHtml = marked.parse(answer);           //解析 Markdown 为 HTML
        const safeHtml = DOMPurify.sanitize(rawHtml);   //安全过滤 + 渲染到 div
        cache.DivAnswer.innerHTML=safeHtml;
        this.DivMessageList.scrollTop = this.DivMessageList.scrollHeight;
    }

    WriterAIReasoning(answer, cache)
    {
        this.RemoveThinking(cache);
        if (!cache.DivReasoning) return;

        cache.DivReasoning.innerText = answer;
        cache.DivReasoning.style.display="block";
        cache.DivReasoning.innerHTML += '<span class="HQChart_AI_Typing_cursor"></span>';
        this.DivMessageList.scrollTop = this.DivMessageList.scrollHeight;
    }

    async SendFileData(message, content, fileName, aryDemoQuestion)
    {
        var token=this.GetToken();
        var botId=this.GetBotID();
        if (!token || !botId)
        {
            alert("没有配置扣子token,或botId");
            return;
        }

        if (!content || !fileName) return;
        
        try
        {
            //上传文件
            this.AddMessage(message, 'user');
            var updateResult = await this.UploadFile(content, fileName);
            var fileId=updateResult.FileID;
            var answerMessage="文件上传完成.请输入问题.\r\n";
            if (IFrameSplitOperator.IsNonEmptyArray(aryDemoQuestion))
            {
                answerMessage+="如:\n";
                for(var i=0;i<aryDemoQuestion.length;++i)
                {
                    answerMessage+=aryDemoQuestion[i];
                    answerMessage+="\n";
                }
            }
            this.AddMessage(answerMessage, 'ai');

            this.AryUploadFileCache.push({ FileID:fileId, FileName:fileName }); //放入缓存 对话的时候用
        }
        catch (e) 
        {
            this.AddMessage("文件上传失败.", 'ai');
            //this.SetStatus('错误: ' + e.message, true);
            console.error(e);
        } 
        finally 
        {
            
        }
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
    async StreamChat(conversationId, prompt) 
    {
        var content, contentType;
        if (IFrameSplitOperator.IsNonEmptyArray(this.AryUploadFileCache)) 
        {
            var aryContent=[];
            aryContent.push({ type: 'text', text: prompt });

            for(var i=0;i<this.AryUploadFileCache.length;++i)
            {
                var item=this.AryUploadFileCache[i];
                aryContent.push({ type: 'file', file_id: item.FileID })
            }
           
            content = JSON.stringify(aryContent);
            contentType = 'object_string';
        } 
        else 
        {
            content = prompt;
            contentType = 'text';
        }

        var token=this.GetToken();
        var botId=this.GetBotID();
        var url=this.CHAT_URL;
        if (conversationId) url=`${this.CHAT_URL}?conversation_id=${conversationId}`;
        const response = await fetch(url, 
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
                //conversation_id: conversationId,
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
        var reasoning="";
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

                            
                            if (data.type === 'answer' && data.content)     //回答内容
                            {
                                answer += data.content;

                                // 实时更新显示
                                this.WriteAIAnswer(answer, false, cahce);
                            }
                            else if (data.type === 'answer' && data.reasoning_content)  //推理
                            {
                                reasoning += data.reasoning_content;

                                // 实时更新显示
                                this.WriterAIReasoning(reasoning, cahce);
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