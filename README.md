# 使用说明
## 设计思路
### 主要目的
网站的主要的目的是为了复习，因为自学的话很容易没有足够的复习。而复习在语言学习中其实是必须的，不反复出现的东西大脑就会当成没有用的东西不会形成长期记忆。<br/>
另外，使用中你会发现每轮复习都是20个句子。刷新后会这些句子也会刷新，但这里我取数据的逻辑并不是简单地随机取20个用户插入的数据，而是有复习次数和应该复习次数的概念。<br/>
按照记忆曲线理论，我们学习的内容大概N秒/分钟/小时/天/周/月/年后都需要复习一下才能取得最佳的对抗遗忘的效果，然而现实中我们都是人类而不是机器，显然不可能严格按照这个来复习，所以我引入了应该复习次数的概念，每次到达了对应的时间，应该复习次数就加1，而实际复习次数没到应该复习次数的话，就是应该复习的，就会被允许展示在列表中。

### 读和写
复习的单位是用户自己搜集来的日语句子，搜集后在输入框中输入，AI会对于句子给出语法分析，假名音标和中文翻译。
另外，最后只有手敲一遍内容完全正确之后，才算完成了一次复习。

### 听和说
自学的话没有日本人老师，口音很可能是个问题，为了保证口音不会很奇怪，采用了微软的朗读API，好在这个时代AI的声音已经无限接近人类了，当然价格免费（目前看似乎是免费）的微软API要差一些，不过效果仍然可以接受。在听完机器朗读后，点击录音按钮，模仿着背诵整个句子，然后听自己录音的回放，看看哪里很奇怪就改正，这个环节必不可少，是形成肌肉记忆的必经之路。

## Tips
### 句子来源
关于日文句子哪里来，我自己的话大致有以下几个来源：
1. 听力APP，JLPT NX日本語能力試験，X换成对应的数字就可以了，在日区和国区应该都有。APP需要付费，不过可以拷贝听力原文，可以任意跳转到没听懂的地方反复听，光是这两个功能感觉就值得那点钱了。
2. 刷题（红蓝宝书）和B站上的刷题和语法讲解视频（金说日语，人不在东京，SAGA先生，日语翻译小昊子等）的时候，遇到不会的句子直接打出来然后输入到自己的网站中。
3. Netflix上看动漫，日剧等，不像刷题是一个一个句子来的，看剧的话有很多句子，一个一个打下来太麻烦，所以推荐用浏览器[插件]（https://www.languagereactor.com)的自动断句和拷贝文本功能。
### 录音服务
之前用的是谷歌云存储的服务来存储录制下来的音频，但是显然每次都要多次调用上传接口并且存储大量文件是非常费钱的（3万多日元1个月），并不知道能否通过技术方案的改变来降低费用，感觉会很麻烦，所以干脆下掉了线上的录音功能。<br/>
然而录音和重放显然是刚需，所以实现了一个本地上传和读取的API，只需要启动一个本地服务器，然后本地启动项目就可以了。因为能开口说其实都是在家，而在家就没有必要用线上环境，直接用本地环境就可以了。<br/>

## 项目启动
```
// 终端0：网站本体
npm install 
npm run dev
// 终端1：本地录音文件服务器启动
npm i http-server -g
cd public
http-server
```
