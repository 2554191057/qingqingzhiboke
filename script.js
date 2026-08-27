/* =============================================
   庆庆纸博客 · 交互脚本
   ============================================= */
(function () {
  'use strict';

  // 混合设备动态检测：触摸时加 .touch-only 禁用悬停，真实鼠标移动时移除
  // 纯触屏设备已由 <head> 内联脚本提前检测；此处处理 Surface/iPad 等混合输入设备
  document.addEventListener('touchstart', function() {
    document.documentElement.classList.add('touch-only');
  }, { passive: true });
  document.addEventListener('mousemove', function(e) {
    // movementX/Y 为 0 表示是触摸合成的鼠标事件，跳过
    if ((e.movementX || e.movementY) && document.documentElement.classList.contains('touch-only')) {
      document.documentElement.classList.remove('touch-only');
    }
  }, { passive: true });

  /* ---------- 可配置数据 · 用户在这里修改！ ---------- */

  // 社交账号信息
  const SOCIAL_CONFIG = {
    qq: {
      number: '2554191057', // QQ号
      // 加好友协议链接，把 uin=后面换成你的QQ
      jumpLink: 'https://qm.qq.com/q/I4DmGLYs8i',
      // Web版QQ备用链接（当协议不支持时用）
      webLink: 'https://qm.qq.com/q/I4DmGLYs8i',
      // App 唤起协议：移动端拉起加好友名片，PC 端走 AddContact
      appScheme: () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        ? 'mqqapi://card/show_pslcard?src_type=internal&version=1&card_type=person&uin=2554191057&source=qrcard'
        : 'tencent://AddContact/?fromId=45&SubVer=51&uin=2554191057&sourceId=13',
      // 应用商店备选：唤起失败重试后仍失败时跳转下载
      storeUrl: () => /Android/i.test(navigator.userAgent)
        ? 'https://sj.qq.com/appdetail/com.tencent.mobileqq'
        : 'https://apps.apple.com/cn/app/qq/id444934666'
    },
    wechat: {
      id: 'yjqjava', // 微信号
      nickname: '庆庆纸',    // 微信昵称
      // App 唤起协议：直接拉起微信 App
      appScheme: 'weixin://',
      // 应用商店备选
      storeUrl: () => /Android/i.test(navigator.userAgent)
        ? 'https://sj.qq.com/appdetail/com.tencent.mm'
        : 'https://apps.apple.com/cn/app/wechat/id414478124'
    },
    kuaishou: {
      // 快手主页链接，替换成你的
      homePage: 'https://v.kuaishou.com/KW1HbUAN',
      快手号: 'qqz200786',
      // 先尝试 App 内 webview 打开用户主页，再回退通用唤起
      appScheme: () => {
        const ua = navigator.userAgent;
        const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
        if (isMobile) {
          return `kwai://webview?url=${encodeURIComponent('https://v.kuaishou.com/KW1HbUAN')}`;
        }
        return 'kwai://home';
      },
      // 应用商店备选
      storeUrl: () => /Android/i.test(navigator.userAgent)
        ? 'https://sj.qq.com/appdetail/com.smile.gifmaker'
        : 'https://apps.apple.com/cn/app/kuaishou/id440948110'
    },
    douyin: {
      // 抖音主页链接，替换成你的
      homePage: 'https://v.douyin.com/-IDbOAWYFAg/',
      id: '69997247319',
      appScheme: 'snssdk1128://feed',
      // 应用商店备选
      storeUrl: () => /Android/i.test(navigator.userAgent)
        ? 'https://sj.qq.com/appdetail/com.ss.android.ugc.aweme'
        : 'https://apps.apple.com/cn/app/douyin/id1142110895'
    },
    email: '2554191057@qq.com'
  };

  // 网易云热评 · 每次打开随机展示一条
  // c = 评论内容，a = 歌曲名（可选）
  const HOT_COMMENTS = [
    { c: '我希望你过得好，不然对不起我不打扰你。', a: '《不将就》' },
    { c: '后来再听到你的名字，我也能笑着和别人说起你。', a: '《后来》' },
    { c: '如果有一天你走了，我不送你；你来，无论多大风多大雨，我要去接你。', a: '《柠檬树》' },
    { c: '所谓父女母子一场，只不过意味着，你和他的缘分就是今生今世不断地在目送他的背影渐行渐远。', a: '《亲爱的路人》' },
    { c: '这世上所有的久处不厌，都是因为用心。', a: '《慢慢喜欢你》' },
    { c: '愿你出走半生，归来仍是少年。', a: '《少年》' },
    { c: '陪伴是最长情的告白。', a: '《陪你度过漫长岁月》' },
    { c: '愿你喜欢的人也喜欢你，想念的人也正在想念你。', a: '《喜欢》' },
    { c: '十年前的心脏很厚，用力才能碎，里面是红领巾、发条青蛙、鸡毛毽子、信纸和崭新的回力运动鞋。十年后的心脏很薄，一吹就能破，里面是啤酒瓶、失眠夜、路灯、黑眼圈和舍不得的你。', a: '《十年》' },
    { c: '小时候总是骗爸妈自己没钱了，现在总是骗爸妈自己还有钱。', a: '《父亲写的散文诗》' },
    { c: '据说那些你一笑就跟着你笑的人，如果不是傻子，就是喜欢你。', a: '《因为爱情》' },
    { c: '你坐在我的对面，看起来是那么近，又那么远。', a: '《最熟悉的陌生人》' },
    { c: '如果你认识从前的我，也许你会原谅现在的我。', a: '《倾城》' },
    { c: '故事的开头总是这样，适逢其会，猝不及防；故事的结局总是这样，花开两朵，天各一方。', a: '《从你的全世界路过》' },
    { c: '我曾经跨过山和大海，也穿过人山人海。', a: '《平凡之路》' },
    { c: '愿你有个灿烂的前程，愿你有情人终成眷属，愿你在尘世获得幸福。', a: '《面朝大海》' },
    { c: '有的人，一辈子只遇见一次就够了。', a: '《一次就好》' },
    { c: '你说你穷得只剩钱了，我说我富得只剩下你了。', a: '《好久不见》' },
    { c: '后来，除了梦以外的地方，我都叫不到你了。', a: '《后来》' },
    { c: '其实真正送别没有长亭古道，没有劝君更尽一杯酒，就是在一个和平时一样的清晨，有的人留在昨天了。', a: '《送别》' },
    { c: '我听过一万首歌，看过一千部电影，读过一百本书，却从未俘获一个人的心。', a: '《我喜欢上你时的内心活动》' },
    { c: '我想和你互相浪费，一起虚度短的沉默，长的无意义，一起消磨精致而苍老的宇宙。', a: '《我想和你虚度时光》' },
    { c: '我实在不愿看到你难过，哪怕是在我面前装出来的。', a: '《突然好想你》' },
    { c: '愿你有一天能和这个不完美的世界和解。', a: '《世界》' },
    { c: '如果快乐太难，那我祝你平安。', a: '《平安》' },
    { c: '愿你历遍山河，觉得人间值得。', a: '《人间》' },
    { c: '我用什么才能留住你？我给你瘦落的街道、绝望的落日、荒郊的月亮，我给你一个久久望着孤月的人的悲哀。', a: '《我用什么才能留住你》' },
    { c: '所爱隔山海，山海不可平。海有舟可渡，山有路可行。此爱翻山海，山海亦可平。', a: '《山海》' },
    { c: '年轻时，我们是在开始爱情，还是在结束爱情。', a: '《开始的地方》' },
    { c: '你是我枯水年纪里的一场雨，你下得酣畅淋漓，我淋得一病不起。', a: '《雨》' },
    { c: '愿你有前进一寸的勇气，亦有后退一尺的从容。', a: '《勇气》' },
    { c: '其实我一直在你身后，就差你一个回头。', a: '《一直都在》' },
    { c: '人常常都是这么误会自己的，以为自己恋旧，以为自己长情，其实只是现在过的不好，没人爱，还骗自己说是执着。', a: '《执着》' },
    { c: '你站在桥上看风景，看风景的人在楼上看你。明月装饰了你的窗子，你装饰了别人的梦。', a: '《断章》' },
    { c: '从此之后，我遇见青山，遇见白雾，独自尝这世间的苦与独，却再不能与你重逢了。', a: '《再也》' },
    { c: '以前总觉得温柔是说话轻声细语，后来才知道温柔是一种力量，是对这个世界的妥协，也是对自己的成全。', a: '《温柔》' },
    { c: '祝你今天愉快，你明天的愉快留着我明天再说。', a: '《明天》' },
    { c: '我喜欢你，喜欢到想象不出离开你我会怎样。', a: '《想象》' },
    { c: '愿你一生有山可靠，有树可依，有酒可饮，有梦可栖，有茶可温，有人可盼。', a: '《山与树》' },
    { c: '你说孤独的人很可怜，我说孤独的人最清醒，因为没人和他装糊涂。', a: '《孤独》' },
    { c: '我多想拥抱你，可惜时光之里山南水北，可惜你我之间人来人往。', a: '《拥抱》' },
    { c: '我喜欢你，在所有时候。也喜欢有些人，在他们偶尔像你的时候。', a: '《偶尔》' },
    { c: '我们听过无数的道理，却依然过不好这一生。', a: '《后会无期》' },
    { c: '我希望有个如你一般的人，如山间清爽的风，如古城温暖的光，从清晨到夜晚，由山野到书房，只要最后是你，就好。', a: '《从你的全世界路过》' },
    { c: '我一生中最幸运的两件事：一件是时间终于将我对你的爱消耗殆尽；一件是很久很久以前，我遇见了你。', a: '《最幸运》' },
    { c: '我知道你们都走了，所以我也不必再回头。', a: '《不必回头》' },
    { c: '所有分别，都是不合适的人在一起，合适的人终究会相逢。', a: '《相逢》' },
    { c: '你说少年听雨客舟中，江阔云低，断雁叫西风。而今听雨僧庐下，鬓已星星也。', a: '《听雨》' },
    { c: '愿你比别人更不怕一个人独处，愿日后想起时你会被自己感动。', a: '《独处》' },
    { c: '其实酒不好喝，我也不爱喝，只是喜欢那种昏昏欲坠，晕晕乎乎的感觉，因为那时烦恼都在脚下。', a: '《酒》' },
    { c: '我做过最有勇气的事，就是放弃了你。', a: '《勇气》' },
    { c: '人这辈子，最不能辜负的就是三种人：无条件信任你的人，不求回报爱你的人，真心真意帮你的人。', a: '《不负》' },
    { c: '岁月不饶人，我亦未曾饶过岁月。', a: '《岁月》' },
    { c: '遇见是两个人的事，离开却是一个人的决定。', a: '《遇见》' },
    { c: '你说要敬往事一杯酒，再爱也不回头。实际就算你被那晚的酒醉到吐，那人只要伸手，你还是会跟他走。', a: '《往事》' },
    { c: '人生最好的三种状态：不期而遇，不言而喻，不药而愈。', a: '《状态》' },
    { c: '愿你所有快乐，无需假装；愿你此生尽兴，赤诚善良。', a: '《尽兴》' },
    { c: '我曾难自拔于世界之大，也沉溺于其中梦话，不得真假，不做挣扎，不惧笑话。', a: '《起风了》' },
    { c: '我喜欢春天的花，夏天的树，秋天的黄昏，冬天的阳光，还有每天的你。', a: '《四季》' },
    { c: '从前车马很慢，书信很远，一生只够爱一个人。', a: '《从前慢》' },
    { c: '后来终于在眼泪中明白，有些人一旦错过就不再。', a: '《后来》' },
    { c: '愿你这一生，既有随处可栖的江湖，也有追风逐梦的骁勇。', a: '《江湖》' },
    { c: '心之所向，素履以往，生如逆旅，一苇以航。', a: '《素履之往》' },
    { c: '我能想到最浪漫的事，就是和你一起慢慢变老。', a: '《最浪漫的事》' },
    { c: '我会变更好的，因为有你在。', a: '《因为你在》' },
    { c: '愿你的世界，永远有阳光，永远有花香，永远有我。', a: '《阳光与花香》' },
    { c: '所有晦暗都留给过往，从遇见你开始，凛冬散尽，星河长明。', a: '《星河》' },
    { c: '生活总是让我们遍体鳞伤，但到后来，那些受伤的地方一定会变成我们最强壮的地方。', a: '《强者》' },
    { c: '我听过最动人的情话，不是我爱你，而是有我在。', a: '《有我在》' },
    { c: '世界上只有一种英雄主义，就是在认清生活真相之后依然热爱生活。', a: '《英雄》' },
    { c: '人生就像一盒巧克力，你永远不知道下一块会是什么味道。', a: '《阿甘正传》' },
    { c: '黑夜给了我黑色的眼睛，我却用它寻找光明。', a: '《一代人》' },
    { c: '面朝大海，春暖花开。', a: '《面朝大海》' },
    { c: '每一个不曾起舞的日子，都是对生命的辜负。', a: '《起舞》' },
    { c: '我和谁都不争，和谁争我都不屑。', a: '《不争》' },
    { c: '幸福不是因为得到的多，而是因为计较的少。', a: '《幸福》' },
    { c: '愿你成为自己的太阳，无需凭借谁的光。', a: '《自己的太阳》' },
    { c: '你以为的极限，只是别人的起点。', a: '《极限》' },
    { c: '世界上最远的距离，不是生与死，而是我站在你面前，你却不知道我爱你。', a: '《距离》' },
    { c: '我希望有一个如你一般的人，贯彻未来，数遍生命的公路牌。', a: '《公路牌》' },
    { c: '有些事现在看来不过如此，但在当时，真的就是一个人熬过来的。', a: '《熬》' },
    { c: '所有你看起来轻而易举的背后，都是拼尽全力。', a: '《拼尽全力》' },
    { c: '长大就是，把原本看重的东西看轻一点，把原本看轻的东西看重一点。', a: '《长大》' },
    { c: '你那么擅长安慰别人，一定度过了很多自己安慰自己的日子吧。', a: '《安慰》' },
    { c: '人真正变强大，不是因为守护着面子，而是抛开面子的时候。', a: '《面子》' },
    { c: '每个人都有一行眼泪，喝下的冰冷的水，酝酿成的热泪。', a: '《眼泪》' },
    { c: '我有所念人，隔在远远乡；我有所感事，结在深深肠。', a: '《乡》' },
    { c: '最怕一生碌碌无为，还安慰自己平凡可贵。', a: '《平凡》' },
    { c: '愿你把日子过成诗，把生活过成酒，把人生过成画。', a: '《诗酒画》' },
    { c: '我们都曾不堪一击，我们终将刀枪不入。', a: '《刀枪不入》' },
    { c: '愿你往后余生，有人陪你看遍星辰大海，也有人陪你细数柴米油盐。', a: '《星辰大海》' },
    { c: '你如今的气质里，藏着你走过的路，读过的书，和爱过的人。', a: '《气质》' },
    { c: '我有一个很大的梦想，不只是想要和你在一起。', a: '《梦想》' },
    { c: '人生没有白走的路，每一步都算数。', a: '《每一步》' },
    { c: '愿你一觉醒来，看到阳光，闻到花香，听到鸟鸣，心里有人，眼中有光。', a: '《醒来》' },
    { c: '这世上没有谁离不开谁，只有谁不珍惜谁。', a: '《珍惜》' },
    { c: '愿你三冬暖，愿你春不寒，愿你天黑有灯，下雨有伞。', a: '《三冬暖》' },
    { c: '你看这世界，山是山，水是水，你是你，我是我。', a: '《你我》' },
    { c: '愿你眼里的光，永远比眼泪多。', a: '《眼里的光》' },
    { c: '所谓成熟，就是越来越能接受本来的自己，也越来越能接受本来的别人。', a: '《成熟》' },
    { c: '愿你以后有酒有肉有姑娘，愿我以后有诗有梦有远方。', a: '《远方》' },
    { c: '愿你余生所遇之人，皆为良人；所历之事，皆为幸事。', a: '《良人》' }
  ];

  // 音乐播放列表已迁移到 ./music/playlist.json

  // 博客文章数据 · 可自由增减
  const BLOG_POSTS = [
    {
      title: '为什么我搭建了这个个人博客？',
      tag: '随笔',
      date: '2026-08-24',
      readTime: '5分钟',
      excerpt: '在这个社交媒体当道的年代，我为什么还要费劲搭建一个属于自己的小博客？其实是用Ai写的',
      icon: '📝',
      coverClass: 'blog-cover-1',
      url: '#social',
      cta: '联系我',
      image: 'https://picsum.photos/seed/blog1/800/500'
    },
    {
      title: 'QQ资源分享交流群',
      tag: '组织',
      date: '2026-08-24',
      readTime: '8分钟',
      excerpt: '分享各种有趣好用工具',
      icon: '🗂️',
      coverClass: 'blog-cover-2',
      url: 'https://qm.qq.com/q/e7snhjBT0s',
      cta: '加入组织',
      image: 'https://s1.imagehub.cc/images/2026/08/25/da2986622b3cb9c13f52f70847a5ecd6.jpg'
    },
    {
      title: '庆庆纸资源共享',
      tag: '组织',
      date: '2026-08-24',
      readTime: '9分钟',
      excerpt: '纸飞机频道',
      icon: '☁️',
      coverClass: 'blog-cover-6',
      url: 'https://t.me/qqzzygx',
      cta: '加入组织',
      vpn: true,
      image: 'https://s1.imagehub.cc/images/2026/08/25/5d98a01f15d66a6f80ad12b86b657146.jpg'
    },
    {
      title: '流光助手 · 网盘解析工具',
      tag: '工具',
      date: '2026-08-24',
      readTime: '1分钟',
      excerpt: '市面上主流网盘齐聚一堂，网盘解析利器',
      icon: '📖',
      coverClass: 'blog-cover-3',
      url: 'https://xz.yodlx.com/',
      cta: '访问工具',
      image: 'https://s1.imagehub.cc/images/2026/08/25/f4cf7db1a6e0966193011fd3f5e6baf5.jpg'
    },
    {
      title: 'TunNet · VPN',
      tag: '工具',
      date: '2026-08-24',
      readTime: '1分钟',
      excerpt: '延迟低，多路线选择，完全免费',
      icon: '🧰',
      coverClass: 'blog-cover-4',
      url: 'https://www.nexttun.net/',
      cta: '访问工具',
      image: 'https://s1.imagehub.cc/images/2026/08/25/659f01d0e0b605f55809fb625bd9abcb.jpg'
    },
    {
      title: '哲风壁纸 · 顶级高清壁纸',
      tag: '资源',
      date: '2026-08-24',
      readTime: '1分钟',
      excerpt: '在线壁纸下载平台超多高清壁纸任你选',
      icon: '🖼️',
      coverClass: 'blog-cover-5',
      url: 'https://haowallpaper.com/',
      cta: '访问网站',
      image: 'https://s1.imagehub.cc/images/2026/08/25/c707a8222ada184f4415c7bd0841f6c6.jpg'
    }
  ];

  // 更多文章（点击"加载更多"显示）
  const BLOG_POSTS_MORE = [
    {
      title: '每日60秒读懂世界',
      tag: '知识',
      date: '2026-08-25',
      readTime: '1分钟',
      excerpt: '每天60秒，带你读懂世界.精选每日热点知识，一分钟了解天下事，让你足不出户也能掌握全球动态',
      icon: '🌍',
      coverClass: 'blog-cover-1',
      url: 'https://60s.coom.cn/',
      cta: '查看全文',
      image: 'https://s1.imagehub.cc/images/2026/08/25/5d15dfe11632c0bda145a9ec4ada89c7.jpg'
    },
    {
      title: 'Uotan Toolbox：为极客打造的现代刷机工具箱',
      tag: '工具',
      date: '2026-08-24',
      readTime: '5分钟',
      excerpt: '一款开源的图形化刷机工具箱：刷入 Recovery、修补 Boot、线刷、应用管理、Scrcpy 投屏全都有，Windows / Linux / macOS 全平台可用',
      icon: '🔧',
      coverClass: 'blog-cover-2',
      url: '#',
      type: 'article',
      content: `
        <h2>Uotan Toolbox：为极客打造的现代刷机工具箱</h2>
        <p>玩机刷机总在命令行里敲来敲去？推荐一款开源又清爽的图形化工具箱——<strong>Uotan Toolbox（柚坛工具箱）</strong>。它把刷机、设备管理、应用操作等高频玩法集中到一个干净的图形界面里，官网即可下载，覆盖 Windows、Linux、macOS 三大平台。</p>
        <h3>它是什么</h3>
        <p>Uotan Toolbox 是一款基于 C# 开发的开源图形界面程序（GitHub：Uotan-Dev/UotanToolBox），从最初的"Recovery 刷入工具"一路迭代成功能完整的刷机工具箱。官网的标语是 "A Modern Toolbox for Geeks"——为极客打造的现代工具箱，目前全新版本 UotanToolboxNT 也在开发中。</p>
        <h3>核心刷机功能</h3>
        <ul>
          <li><strong>刷入 Recovery</strong>：一键刷入第三方 Recovery，省去手动敲命令</li>
          <li><strong>修补 Boot</strong>：支持修补 boot 镜像（如 Magisk 补丁），方便获取 Root</li>
          <li><strong>线刷模式</strong>：Fastboot 线刷系统，支持分区管理、详细刷机日志记录</li>
          <li><strong>自定义刷入</strong>：按需选择分区与刷机脚本，适配不同机型</li>
          <li><strong>一键刷机</strong>：选好 ROM 包和脚本即可完成流程，无需繁琐手动操作</li>
        </ul>
        <h3>除了刷机，还有这些实用模块</h3>
        <ul>
          <li><strong>系统备份与恢复</strong>：刷机前完整备份数据，支持加密备份包，避免数据丢失</li>
          <li><strong>应用管理</strong>：批量安装 / 卸载 / 备份 / 恢复应用，一站式管理</li>
          <li><strong>Scrcpy 投屏</strong>：把安卓设备屏幕投射到电脑，用键鼠直接控制</li>
          <li><strong>无级调节</strong>：调整 CPU 频率与内存分配策略，提升游戏与应用流畅度</li>
          <li><strong>设备解锁</strong>：解锁文件解锁、基本命令解锁、ADB / Fastboot 驱动补丁、高通 9008 等</li>
        </ul>
        <h3>多平台下载</h3>
        <p>官网 <strong>toolbox.uotan.cn</strong> 提供全平台安装包：Windows 有 x64 / arm64 的 Installer 和 Portable 两个版本；Linux 提供 x64 / arm64 / loong64（龙芯）三个版本；macOS 提供 x64 / arm64 版本。选好对应架构下载即可，Portable 版免安装、解压即用。</p>
        <h3>适合谁用</h3>
        <p>无论你是刷机老手还是刚入门的新手，Uotan Toolbox 都能降低操作门槛：新手靠图形界面避免敲错命令，老手靠丰富的模块提升效率。而且它完全开源（LGPL-3.0 协议），功能还在持续迭代，值得玩机爱好者收藏。</p>
        <p>官方下载：<a href="https://toolbox.uotan.cn/" target="_blank" rel="noopener">https://toolbox.uotan.cn/</a></p>
      `,
      cta: '阅读全文',
      image: 'https://picsum.photos/seed/blog9/800/500'
    },
    {
      title: 'ROM 固件下载站：刷机救砖升级降级一站搞定',
      tag: '工具',
      date: '2026-08-24',
      readTime: '4分钟',
      excerpt: '一个收录官方固件（ROM）的下载站：刷机、救砖、升级、降级全覆盖，支持小米、OPPO、vivo 系机型，按品牌浏览即可下载官方固件',
      icon: '💾',
      coverClass: 'blog-cover-3',
      url: '#',
      type: 'article',
      content: `
        <h2>ROM 固件下载站：刷机救砖升级降级一站搞定</h2>
        <p>刷机、救砖、升级、降级，最怕的就是找不到靠谱的官方固件。推荐一个简洁好用的固件下载站——<strong>rom.oppo.help</strong>，按品牌分类收录官方 ROM，从选择厂商到下载固件只需几步。</p>
        <h3>它提供什么</h3>
        <p>网站的核心功能一目了然：<strong>Flash（刷机）、Unbrick（救砖）、Upgrade（升级）、Downgrade（降级）</strong>。无论你是想给手机刷入官方系统、不小心变砖需要救回，还是想升级 / 降级系统版本，都能在这里找到对应的官方固件（ROM）。</p>
        <h3>覆盖三大品牌系</h3>
        <ul>
          <li><strong>Xiaomi 小米系</strong>：小米（Mi）· 红米（Redmi）· POCO</li>
          <li><strong>OPPO 系</strong>：OPPO · 一加（OnePlus）· realme（真我）</li>
          <li><strong>VIVO 系</strong>：vivo · iQOO</li>
        </ul>
        <p>进入首页选择对应 OEM 品牌，即可浏览和下载该品牌机型的官方固件，流程直观，不用绕来绕去。</p>
        <h3>为什么推荐它</h3>
        <ul>
          <li><strong>官方固件</strong>：面向刷机 / 救砖场景提供官方 ROM，比来路不明的第三方包更省心</li>
          <li><strong>按品牌索引</strong>：小米 / OPPO / vivo 三大阵营清晰分类，机型查找方便</li>
          <li><strong>覆盖刷机全场景</strong>：升级、降级、救砖一站式，适合玩机用户收藏</li>
        </ul>
        <h3>使用建议</h3>
        <p>刷机有风险，动手前记得备份重要数据，确认好机型和对应固件版本再操作；变砖救砖时按官方步骤进行，避免误刷导致更严重的问题。</p>
        <p>访问地址：<a href="https://rom.oppo.help/" target="_blank" rel="noopener">https://rom.oppo.help/</a></p>
      `,
      cta: '阅读全文',
      image: 'https://picsum.photos/seed/blog17/800/500'
    },
    {
      title: '为什么我开始写晨间日记',
      tag: '生活',
      date: '2026-08-24',
      readTime: '6分钟',
      excerpt: '每天早上写三行字：今天最该做什么、昨天的一个小确幸、一句给自己的话。坚持 60 天，它成了我和自己开早会的方式。',
      icon: '🌞',
      coverClass: 'blog-cover-4',
      url: '#',
      image: 'https://picsum.photos/seed/blog10/800/500'
    },
    {
      title: '数字极简：删掉 80% App 之后',
      tag: '数字',
      date: '2026-08-24',
      readTime: '7分钟',
      excerpt: '一次删掉手机里 80% 的 App，只留 12 个真正常用的。第一周难受，第三周开始轻松——原来我之前一直在给工具打工。',
      icon: '📲',
      coverClass: 'blog-cover-5',
      url: '#',
      image: 'https://picsum.photos/seed/blog11/800/500'
    },
    {
      title: '深度阅读：在信息洪流里真正吸收',
      tag: '方法',
      date: '2026-08-24',
      readTime: '8分钟',
      excerpt: '收藏不等于学到。我改用“读一章、合上、写三句话”的方式，一年读的书少了，记住的反而多了。这是我的深度阅读流程。',
      icon: '📚',
      coverClass: 'blog-cover-6',
      url: '#',
      image: 'https://picsum.photos/seed/blog12/800/500'
    },
    {
      title: '爱玩机工具箱：解锁玩机新姿势的安卓系统工具',
      tag: '工具',
      date: '2026-08-24',
      readTime: '5分钟',
      excerpt: '集成 400+ 项专业功能的安卓系统工具，免 Root 与 Root 双模式，应用管理、系统优化、Magisk 模块、Xposed 框架全都有，9 年沉淀的老牌玩机工具箱',
      icon: '🛠️',
      coverClass: 'blog-cover-1',
      url: '#',
      type: 'article',
      content: `
        <h2>爱玩机工具箱：解锁玩机新姿势</h2>
        <p>如果你喜欢折腾安卓设备，一定听说过 <strong>爱玩机工具箱（爱玩机）</strong>——一款运营了 9 年（2016–2026+）的老牌安卓系统工具。它集成了 400+ 项专业功能，主打"基于 ROOT + 系统 API + 自由奇思妙想"，无论是小白还是极客都能找到适合自己的玩法。</p>
        <h3>免 Root 也能玩，Root 之后更强大</h3>
        <p>爱玩机支持两种使用模式，门槛很灵活：</p>
        <ul>
          <li><strong>免 Root 模式</strong>：通过 Shizuku + 系统无线调试激活，无需解锁也能用上应用管理、自启管理、应用冻结、文件管理、系统信息查看等实用功能，覆盖约 40%–70% 的功能</li>
          <li><strong>Root 模式</strong>：解锁 100% 全部功能，包括深度系统定制、Magisk 模块管理、Xposed 框架支持、完整应用管理（冻结 / 隐藏 / 卸载）、系统级优化、广告组件查杀等</li>
        </ul>
        <h3>21 大板块，400+ 功能</h3>
        <p>体积仅约 10M，却塞下了 21 项大板块、400 多项功能：设备信息查看、硬件状态监测、系统组件管理、应用管理与备份、参数检测、修改系统标识、刷入第三方 ROM、调整系统参数……还内置 2 款桌面小部件（比如桌面实时查看内存占用）。</p>
        <h3>遵循 Magisk 挂载，OTA 无忧</h3>
        <p>爱玩机遵循 Magisk 挂载方式运行，所有参数设置都可在 Magisk 环境下修改，方便后续系统 OTA 更新，不会因为系统升级而被还原或产生冲突。</p>
        <h3>清晰的版本体系</h3>
        <p>爱玩机提供清晰的版本分支：<strong>试用版</strong>（先免费体验再决定是否付费）、<strong>A 版本</strong>（内测用户抢先体验新功能）、<strong>B 版本</strong>（极客用户临时功能整改）、<strong>S 版本</strong>（稳定用户慢速更新）。不同版本对应不同的尝鲜与稳定需求。</p>
        <h3>使用与支持</h3>
        <p>应用文件目录：主文件在内部存储 Documents/advanced，下载文件在 Download/advanced。官网 doc.byyoung.top 提供下载、使用教程、常见问题、交流讨论与捐赠支持。</p>
        <p>官方文档：<a href="https://doc.byyoung.top/" target="_blank" rel="noopener">https://doc.byyoung.top/</a></p>
      `,
      cta: '阅读全文',
      image: 'https://picsum.photos/seed/blog13/800/500'
    },
    {
      title: '给自己设个"免打扰"时段',
      tag: '方法',
      date: '2026-08-24',
      readTime: '4分钟',
      excerpt: '每天 90 分钟免打扰：关通知、关微信、只做一件难事。坚持两个月，这是我产出最高、焦虑最少的一个习惯。',
      icon: '🔕',
      coverClass: 'blog-cover-2',
      url: '#',
      image: 'https://picsum.photos/seed/blog14/800/500'
    },
    {
      title: '从焦虑到行动：两分钟法则',
      tag: '随笔',
      date: '2026-08-24',
      readTime: '5分钟',
      excerpt: '能在两分钟内做完的事，立刻做掉。这个小规矩帮我清掉了无数拖延的小事，也让大脑腾出空间留给真正重要的事。',
      icon: '⚡',
      coverClass: 'blog-cover-3',
      url: '#',
      image: 'https://picsum.photos/seed/blog15/800/500'
    },
    {
      title: '给生活做减法：我的断舍离清单',
      tag: '生活',
      date: '2026-08-24',
      readTime: '5分钟',
      excerpt: '一年扔掉 200 件东西后我发现：真正需要的远比以为的少。分享我的断舍离三问——还用吗、还爱吗、没了会怎样。',
      icon: '🧹',
      coverClass: 'blog-cover-4',
      url: '#',
      image: 'https://picsum.photos/seed/blog16/800/500'
    },
    {
      title: '写作是最便宜的思考工具',
      tag: '随笔',
      date: '2026-08-24',
      readTime: '6分钟',
      excerpt: '想不清楚就写下来。写作不是输出，是思考的过程。这三年我用每天 15 分钟自由书写，理清了大多数纠结。',
      icon: '✍️',
      coverClass: 'blog-cover-5',
      url: '#',
      image: 'https://picsum.photos/seed/blog17/800/500'
    },
    {
      title: '为什么我每周留一个"无计划日"',
      tag: '生活',
      date: '2026-08-24',
      readTime: '4分钟',
      excerpt: '每周日我不排任何计划，爱做什么做什么。最初觉得浪费，后来发现正是这一天养回了下一周的行动力。',
      icon: '🛋️',
      coverClass: 'blog-cover-6',
      url: '#',
      image: 'https://picsum.photos/seed/blog18/800/500'
    },
    {
      title: '用清单代替记忆：解放大脑的 7 个场景',
      tag: '效率',
      date: '2026-08-24',
      readTime: '7分钟',
      excerpt: '大脑用来思考，不是用来记事。从购物、旅行到搬家，我用 7 类清单把记忆外包，从此少忘事、少焦虑。',
      icon: '📝',
      coverClass: 'blog-cover-1',
      url: '#',
      image: 'https://picsum.photos/seed/blog19/800/500'
    },
    {
      title: '在通勤路上的一年：碎片时间变成了什么',
      tag: '随笔',
      date: '2026-08-24',
      readTime: '8分钟',
      excerpt: '每天通勤 40 分钟，一年就是 240 小时。我用它听书、复盘、发呆。一年下来，竟读完了 12 本一直没空读的书。',
      icon: '🚇',
      coverClass: 'blog-cover-2',
      url: '#',
      image: 'https://picsum.photos/seed/blog20/800/500'
    }
  ];

  // 标签排序优先级：组织 > 工具 > 资源 > 知识 > 效率 > 方法 > 数字 > 生活 > 随笔
  const TAG_ORDER = {
    '组织': 1,
    '工具': 2,
    '资源': 3,
    '知识': 4,
    '效率': 5,
    '方法': 6,
    '数字': 7,
    '生活': 8,
    '随笔': 9
  };
  const ALL_BLOG_POSTS = [...BLOG_POSTS, ...BLOG_POSTS_MORE].sort((a, b) => {
    const orderA = TAG_ORDER[a.tag] || 99;
    const orderB = TAG_ORDER[b.tag] || 99;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.date) - new Date(a.date);
  });
  // 初始显示量（首屏）：桌面 6、手机 4——与 .blog-grid 列数呼应 3列×2行=6、2列×2行=4
  const BLOG_INITIAL_DESKTOP = 6;
  const BLOG_INITIAL_MOBILE = 4;
  // 每次加载更多增量：桌面 3、手机 2——3列×1行=3、2列×1行=2
  const BLOG_STEP_DESKTOP = 3;
  const BLOG_STEP_MOBILE = 2;
  const BLOG_MQ = window.matchMedia('(max-width: 900px)');
  let blogVisibleCount = 0;
  let blogExpandScrollY = 0; // 最近一次"加载更多"前的滚动位置，供收纳回滚

  // 资源分享数据 · 可自由增减
  const RESOURCES = [
    {
      title: '【光鸭网盘】2026最新资源',
      desc: '包含网盘解析、免费影视。',
      icon: '📄',
      type: 'guangya',
      typeLabel: '光鸭网盘',
      link: 'https://www.guangyapan.com/s/1938716075945959448_akkyF53PjUHBL9Ew',
      code: '无提取码',
      size: '不限速下载',
      date: '2026-08-24',
      badges: [{ text: '🔥 热门', cls: 'hot' }, { text: '✨ 新更', cls: 'new' }]
    },
    {
      title: '【123云盘】2026最新资源',
      desc: '有杂七杂八的刷机工具和系统包。',
      icon: '🎬',
      type: '123',
      typeLabel: '123云盘',
      link: 'https://1828841094.share.123pan.cn/123pan/T9r7jv-t8KAA',
      code: '无需提取码',
      size: '不限速下载',
      date: '2026-08-12',
      badges: [{ text: '🔥 热门', cls: 'hot' }]
    },
    {
      title: '【天翼云盘】2026最新资源',
      desc: '资源分享。',
      icon: '🎓',
      type: 'alicloud',
      typeLabel: '天翼云盘',
      link: 'https://cloud.189.cn/t/zyIzqaYJVRZb',
      code: 'bco2',
      size: '不限速下载',
      date: '2026-08-24',
      badges: [{ text: '✨ 新更', cls: 'new' }]
    },
    {
      title: '【迅雷网盘】2026最新资源',
      desc: '迅雷网盘资源分享。',
      icon: '⚡',
      type: 'xunlei',
      typeLabel: '迅雷网盘',
      link: 'https://pan.xunlei.com/s/your-link',
      code: '无提取码',
      size: '不限速下载',
      date: '2026-08-24',
      badges: [{ text: '✨ 新更', cls: 'new' }]
    },
    {
      title: '【百度网盘】2026最新资源',
      desc: '百度网盘资源分享。',
      icon: '📁',
      type: 'baidu',
      typeLabel: '百度网盘',
      link: 'https://pan.baidu.com/s/your-link',
      code: '无提取码',
      size: '不限速下载',
      date: '2026-08-24',
      badges: [{ text: '🔥 热门', cls: 'hot' }]
    },
    {
      title: '【夸克网盘】2026最新资源',
      desc: '夸克网盘资源分享。',
      icon: '📂',
      type: 'quark',
      typeLabel: '夸克网盘',
      link: 'https://pan.quark.cn/s/your-link',
      code: '无提取码',
      size: '不限速下载',
      date: '2026-08-24',
      badges: [{ text: '✨ 新更', cls: 'new' }]
    }
  ];

  /* ---------- 通用工具函数 ---------- */
  const $  = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  // Toast（iOS 灵动岛风格）
  let toastTimer = null;
  const TOAST_DURATION = 5000;

  function showToast(text, isError = false) {
    const toast = $('#toast');
    const label = $('#toastText');
    if (!toast || !label) return;

    const wasVisible = toast.classList.contains('show');
    const maxAllowed = window.innerWidth - 40;

    // 更新图标
    const icon = toast.querySelector('.toast-icon');
    if (icon) {
      icon.className = 'toast-icon fa-solid ' + (isError ? 'fa-circle-xmark' : 'fa-circle-check');
    }
    // 仅「点击任意位置开始播放音乐」引导提示不显示左侧图标，避免挤压文字显示不全；其余 Toast 保留图标
    toast.classList.toggle('no-icon', text.indexOf('点击任意位置开始播放音乐') !== -1);

    // 测量：解除所有尺寸约束，按单行测文字自然宽度
    toast.style.maxWidth = 'none';
    toast.style.width = 'auto';
    toast.style.minWidth = '0';
    toast.style.transition = 'none';
    label.style.maxWidth = 'none';
    label.style.whiteSpace = 'nowrap';
    toast.style.whiteSpace = 'nowrap';

    requestAnimationFrame(() => {
      label.textContent = text;
      toast.classList.toggle('error', !!isError);

      const naturalW = toast.scrollWidth;
      // 目标宽度按单行自然宽度自适应（≥180px），允许突破视口以完整单行显示；上限 560px 防止超长文字爆屏
      const targetW = Math.min(Math.max(naturalW, 180), Math.max(maxAllowed, 560));

      // 恢复过渡
      requestAnimationFrame(() => {
        toast.style.transition = '';
        toast.style.width = 'auto';
        toast.style.minWidth = '180px';
        toast.style.maxWidth = targetW + 'px';
        toast.style.setProperty('--toast-w', targetW + 'px');

        if (!wasVisible) {
          toast.classList.add('show');
        }
        resetToastTimer();
      });
    });
  }

  // 重置 5 秒自动消失倒计时
  function resetToastTimer() {
    const toast = $('#toast');
    if (!toast) return;

    // 重置进度条动画
    const progress = toast.querySelector('#toastProgress');
    if (progress) {
      progress.style.animation = 'none';
      progress.offsetHeight;
      progress.style.animation = '';
    }

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      // 收起动画：文字淡出，容器 max-width 从两侧向内收缩
      const label = toast.querySelector('#toastText');
      if (label) {
        label.style.transition = 'opacity 0.38s ease, transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)';
        label.style.maxWidth = 'none';
      }
      // 清除内联 maxWidth → CSS base 的 40px 接管，触发收缩动画
      toast.style.maxWidth = '';
      toast.style.width = '';
      toast.style.minWidth = '';
      toast.classList.remove('show');
      // 重置点击计数器
      toastClickCount = 0;
      toast.classList.remove(
        'click-intense-1','click-intense-2','click-intense-3','click-intense-4','click-intense-max',
        'click-shake-1','click-shake-2','click-shake-3','click-shake-4','click-shake-max',
        'click-glow-1','click-glow-2','click-glow-3','click-glow-4','click-glow-max'
      );
      // 动画结束后清理内联样式
      setTimeout(() => {
        if (label) {
          label.style.transition = '';
          label.style.maxWidth = '';
        }
      }, 500);
    }, TOAST_DURATION);
  }

  // Toast 点击交互：涟漪效果 + 重置倒计时 + 渐进式强度
  let toastClickCount = 0;
  const MAX_CLICK_INTENSITY = 4;

  function applyClickIntensity(toast, count) {
    const level = Math.min(count, MAX_CLICK_INTENSITY);
    const intenseCls = level >= MAX_CLICK_INTENSITY ? 'click-intense-max' : `click-intense-${level}`;
    const shakeCls = level >= MAX_CLICK_INTENSITY ? 'click-shake-max' : `click-shake-${level}`;
    const glowCls = level >= MAX_CLICK_INTENSITY ? 'click-glow-max' : `click-glow-${level}`;

    // 清除上一轮的震动/发光类
    toast.classList.remove(
      'click-shake-1','click-shake-2','click-shake-3','click-shake-4','click-shake-max',
      'click-glow-1','click-glow-2','click-glow-3','click-glow-4','click-glow-max',
      'click-pulse-glow','click-pulse-glow-intense'
    );

    // 添加震动 + 一次性发光脉冲
    toast.classList.add(shakeCls);
    toast.classList.add(glowCls);

    // 震动/发光结束后移除（不影响呼吸动画）
    const cleanupTime = 650 + level * 50;
    setTimeout(() => {
      toast.classList.remove(
        'click-shake-1','click-shake-2','click-shake-3','click-shake-4','click-shake-max',
        'click-glow-1','click-glow-2','click-glow-3','click-glow-4','click-glow-max'
      );
    }, cleanupTime);

    return intenseCls;
  }

  function initToastInteractions() {
    const toast = $('#toast');
    if (!toast) return;

    // 点击：渐进式涟漪 + 震动 + 发光
    toast.addEventListener('click', (e) => {
      if (!toast.classList.contains('show')) return;

      toastClickCount++;
      const level = Math.min(toastClickCount, MAX_CLICK_INTENSITY);
      const intenseCls = applyClickIntensity(toast, toastClickCount);

      // 创建涟漪效果
      const ripple = toast.querySelector('.toast-ripple');
      if (ripple) {
        // 增加涟漪尺寸：点击次数越多，涟漪越大
        const rect = toast.getBoundingClientRect();
        const baseSize = Math.max(rect.width, rect.height);
        const scaleFactor = 1.2 + level * 0.35;
        const size = baseSize * scaleFactor;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.remove('animate');
        ripple.offsetHeight;
        ripple.classList.add('animate');

        // 应用强度类到 ripple 容器
        toast.classList.remove('click-intense-1','click-intense-2','click-intense-3','click-intense-4','click-intense-max');
        toast.classList.add(intenseCls);
      }

      // 重置 5 秒自动消失倒计时
      resetToastTimer();
    });

    // 悬停时暂停自动隐藏，离开后重新计时
    toast.addEventListener('mouseenter', () => {
      if (!toast.classList.contains('show')) return;
      toast.classList.add('paused');
      if (toastTimer) {
        clearTimeout(toastTimer);
        toastTimer = null;
      }
    });
    toast.addEventListener('mouseleave', () => {
      if (!toast.classList.contains('show')) return;
      toast.classList.remove('paused');
      resetToastTimer();
    });

    // 键盘支持（Enter/Space 触发涟漪 + 重置倒计时）
    toast.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toast.click();
      }
    });
  }

  // 确保 DOM 就绪后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToastInteractions);
  } else {
    initToastInteractions();
  }

  // 点击账号复制（QQ号 / 微信号 / 快手号 / 抖音号 / 页脚联系方式）
  function bindCopyButtons() {
    $$('.copy-id-btn').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.copyId;
        const ok = await copyText(id);
        const label = btn.dataset.label || btn.closest('.social-card')?.querySelector('h3')?.textContent || '账号';
        const suffix = btn.dataset.label ? '' : '号';
        showToast(ok ? `${label}${suffix} ${id} 已复制` : '复制失败，请手动长按复制', !ok);
      });
    });
  }

  // 复制文本
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch (_) { /* 剪贴板 API 被拒时继续走 execCommand 回退 */ }
      }
      // 兼容回退
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch { return false; }
  }

  // 弹窗控制
  function openModal(id) {
    const mask = document.getElementById(id);
    if (!mask) return;
    mask.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(mask) {
    if (typeof mask === 'string') mask = document.getElementById(mask);
    if (!mask) return;
    mask.classList.remove('show');
    document.body.style.overflow = '';
  }

  let pendingVpnUrl = null;
  function showVpnModal(url) {
    pendingVpnUrl = url;
    openModal('vpnModal');
  }

  function initVpnModal() {
    const vpnModal = $('#vpnModal');
    if (!vpnModal) return;

    $('#vpnYesBtn')?.addEventListener('click', () => {
      const url = pendingVpnUrl;
      closeModal(vpnModal);
      pendingVpnUrl = null;
      if (url) {
        showToast('正在打开链接…');
        const win = window.open(url, '_blank', 'noopener');
        if (!win) showToast('浏览器拦截了弹窗，请手动复制链接访问', true);
      }
    });

    $('#vpnNoBtn')?.addEventListener('click', () => {
      closeModal(vpnModal);
      pendingVpnUrl = null;
      showToast('正在打开 VPN 推荐页…');
      const win = window.open('https://www.nexttun.net/', '_blank', 'noopener');
      if (!win) showToast('浏览器拦截了弹窗，请手动访问 nexttun.net', true);
    });
  }
  function bindModalClose() {
    $$('.modal-mask').forEach(mask => {
      mask.addEventListener('click', (e) => {
        if (e.target === mask || e.target.hasAttribute('data-close')) closeModal(mask);
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') $$('.modal-mask.show').forEach(closeModal);
    });
  }

  /* ---------- 数据渲染 ---------- */

  // 渲染博客卡
  // 生成单张博客卡片 HTML
  function buildBlogCard(p) {
    const isExt = /^https?:\/\//i.test(p.url);
    const isImage = p.type === 'image';
    const isArticle = p.type === 'article';
    const hasImage = !!p.image;
    const isLinkCard = isExt && !isImage && !isArticle;
    const ext = isLinkCard ? ' target="_blank" rel="noopener noreferrer"' : '';
    const href = (isImage || isArticle) ? '#' : (p.vpn ? '#' : p.url);
    const vpnAttr = p.vpn ? ` data-vpn="${p.url}"` : '';
    const posterAttr = p.isPoster ? ' data-poster="true"' : '';
    // 封面图片属性 - 用于点击按钮查看大图
    const imageAttr = hasImage ? ` data-image="${p.image}" data-title="${p.title}"` : '';
    // 类型属性 - 用于按钮点击行为
    let typeAttr = '';
    if (isImage) {
      typeAttr = ` data-type="image" data-title="${p.title}" data-desc="${p.excerpt}"${posterAttr}`;
    } else if (isArticle) {
      typeAttr = ` data-type="article" data-title="${p.title}"`;
    }
    const contentAttr = isArticle ? ` data-content="${encodeURIComponent(p.content || '')}"` : '';
    const linkCardClass = isLinkCard ? ' blog-card-tool' : '';
    const coverStyle = hasImage ? ` style="background-image: url('${p.image}'); background-size: cover; background-position: center;"` : '';
    const coverIcon = hasImage ? '' : `<span>${p.icon}</span>`;
    // QQ资源分享交流群：保持原有普通按钮（用户不需要扩展触摸区域）
    // 其他所有文章：额外加一个"隐形全屏触摸层"，触摸范围 = 整封面
    const isQQGroup = p.title === 'QQ资源分享交流群';
    let viewImageBtn = '';
    if (hasImage) {
      const btnHtml = `<button class="blog-view-image-btn" type="button" aria-label="查看大图"><i class="fa-solid fa-magnifying-glass-plus"></i><span>查看大图</span></button>`;
      if (isQQGroup) {
        viewImageBtn = btnHtml;
      } else {
        // 其他文章：可见按钮 + 覆盖整张封面的透明触摸层（视觉不可见，但整个封面都能点到查看大图）
        viewImageBtn = btnHtml + `<button class="blog-view-image-touch" type="button" aria-hidden="true" tabindex="-1"></button>`;
      }
    }
    const coverTag = `<div class="blog-cover ${p.coverClass}${hasImage ? ' has-image' : ''}"${coverStyle}>${coverIcon}${viewImageBtn}</div>`;
    const titleTag = `<h3>${p.title}</h3>`;
    return `
      <article class="blog-card${linkCardClass}"${vpnAttr}${imageAttr}${typeAttr}${contentAttr}>
        ${coverTag}
        <div class="blog-body">
          <div class="blog-meta">
            <span class="blog-tag">${p.tag}</span>
            <span><i class="fa-regular fa-calendar"></i> ${p.date}</span>
            <span><i class="fa-regular fa-clock"></i> ${p.readTime}</span>
          </div>
          ${titleTag}
          <p class="blog-excerpt">${p.excerpt}</p>
          <a href="${href}" class="blog-readmore"${ext}>
            ${p.cta || '阅读全文'} <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </article>
    `;
  }

  function renderBlog(list, container, prepend = false) {
    const html = list.map(buildBlogCard).join('');
    if (prepend) container.innerHTML = html + container.innerHTML;
    else container.insertAdjacentHTML('beforeend', html);
  }

  // 资源类型图标映射
  const RES_TYPE_ICON = {
    guangya: '<svg class="res-icon-svg"><use href="#icon-guangya"/></svg>',
    '123': '<svg class="res-icon-svg"><use href="#icon-123pan"/></svg>',
    alicloud: '<svg class="res-icon-svg"><use href="#icon-tianyi"/></svg>',
    xunlei: '<svg class="res-icon-svg"><use href="#icon-xunlei"/></svg>',
    baidu: '<svg class="res-icon-svg"><use href="#icon-baidu"/></svg>',
    quark: '<svg class="res-icon-svg"><use href="#icon-quark"/></svg>',
    onedrive: '🟩',
    google: '🌈',
    other: '📦'
  };

  // 渲染资源
  function renderResources(list, container) {
    const html = list.map(r => {
      const badges = (r.badges || []).map(b =>
        `<span class="resource-badge ${b.cls ? 'resource-badge-' + b.cls : ''}">${b.text}</span>`
      ).join('');
      const fullLink = r.code && r.code !== '无需提取码'
        ? `${r.link}  提取码: ${r.code}`
        : r.link;
      return `
        <div class="resource-card">
          <div class="resource-icon res-type-${r.type}">
            <span>${RES_TYPE_ICON[r.type] || RES_TYPE_ICON.other}</span>
          </div>
          <div class="resource-body">
            <h4 class="resource-title">${r.title}</h4>
            <p class="resource-desc">${r.desc}</p>
            <div class="resource-meta">
              <span class="resource-badge"><i class="fa-solid fa-database"></i> ${r.typeLabel}</span>
              ${r.size ? `<span class="resource-badge"><i class="fa-solid fa-file-zipper"></i> ${r.size}</span>` : ''}
              ${r.date ? `<span class="resource-badge"><i class="fa-regular fa-calendar"></i> ${r.date}</span>` : ''}
              ${r.code ? `<span class="resource-badge"><i class="fa-solid fa-key"></i> 提取码: <strong style="letter-spacing:1px;">${r.code}</strong></span>` : ''}
              ${badges}
            </div>
            <div class="resource-actions">
              <button class="resource-btn resource-btn-primary"
                      data-action="open-resource"
                      data-link="${r.link}"
                      data-title="${r.title} · ${r.typeLabel}"
                      data-desc="点击跳转网盘页面，如遇验证请手动输入提取码">
                <i class="fa-solid fa-cloud-arrow-down"></i>&nbsp; 立即前往
              </button>
              <button class="resource-btn resource-btn-secondary"
                      data-action="copy-resource"
                      data-link="${fullLink}"
                      data-name="${r.title}">
                <i class="fa-regular fa-copy"></i>&nbsp; 复制链接+提取码
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    container.innerHTML = html;
  }

  /* ---------- 功能绑定 ---------- */

  // 导航栏滚动效果 & 当前激活项 & 返回顶部
  function bindNavbar() {
    const nav = $('#navbar');
    const back = $('#backToTop');
    const themeToggle = $('#themeToggle');

    // 动态设置导航高度 CSS 变量，适配所有缩放比例和屏幕方向
    function updateNavH() {
      const h = nav?.offsetHeight || 68;
      document.documentElement.style.setProperty('--nav-h', h + 'px');
      const vv = window.visualViewport;
      const vh = vv ? vv.height : window.innerHeight;
      const vw = vv ? vv.width : window.innerWidth;
      const isMobileOrPortrait = vw < 768 || (vh > vw && vw < 1024);
      const extra = isMobileOrPortrait ? 20 : 12;
      document.documentElement.style.setProperty('--nav-offset', (h + extra) + 'px');
    }
    updateNavH();
    window.addEventListener('resize', updateNavH);
    window.addEventListener('orientationchange', () => setTimeout(updateNavH, 300));
    if (window.ResizeObserver && nav) {
      new ResizeObserver(updateNavH).observe(nav);
    }
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateNavH);
    }
    const sections = $$('section[id]').reverse();
    const linkMap = new Map();
    $$('.nav-link[href^="#"]').forEach(a => linkMap.set(a.getAttribute('href').slice(1), a));
    let lastScrollY = 0;
    let lastScrollDir = 0; // 0=未滚动, 1=向下, -1=向上
    const SCROLL_THRESHOLD = 60;
    // 导航链接跳转平滑滚动期间：禁止 onScroll 隐藏导航栏
    let navJumpLock = false;
    let navJumpUnlockTimer = null;

    function onScroll() {
      const st = window.scrollY || document.documentElement.scrollTop;
      nav.classList.toggle('scrolled', st > 20);
      back.classList.toggle('show', st > 400);

      const delta = st - lastScrollY;

      if (Math.abs(delta) > 1) {
        lastScrollDir = delta > 0 ? 1 : -1;
      }

      // 跳转锁定期间：跳过方向隐藏逻辑，保持导航栏可见
      if (!navJumpLock) {
        if (delta > 5 && st > SCROLL_THRESHOLD) {
          nav.classList.add('nav-hidden');
          themeToggle?.classList.add('btn-hidden');
        } else if (delta < -5) {
          nav.classList.remove('nav-hidden');
          themeToggle?.classList.remove('btn-hidden');
        }
      }
      lastScrollY = st;

      $$('.section-scroll-down, .hero-scroll-hint').forEach(btn => {
        btn.classList.toggle('dir-up', lastScrollDir === -1);
      });

      for (const s of sections) {
        if (s.offsetTop - 120 <= st) {
          $$('.nav-link').forEach(a => a.classList.remove('active'));
          linkMap.get(s.id)?.classList.add('active');
          break;
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 暴露接口给 bindNavAutoHide 调用：锁定/解锁滚动隐藏逻辑
    window.__navJumpLock = function(ms) {
      navJumpLock = true;
      // 强制立即显示导航栏
      nav.classList.remove('nav-hidden');
      themeToggle?.classList.remove('btn-hidden');
      if (navJumpUnlockTimer) clearTimeout(navJumpUnlockTimer);
      navJumpUnlockTimer = setTimeout(() => {
        navJumpLock = false;
      }, ms);
    };

    back.addEventListener('click', () => {
      // 从资源区等底部位置回到顶部，滚动距离很长 → 统一用4秒兜底
      window.__navJumpLock?.(4000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 悬停导航链接时给 nav 加标记 → 让当前 active 按钮临时隐藏颜色，只保留 hover 那个
    const navLinks = $$('.nav-link');
    navLinks.forEach(a => {
      a.addEventListener('mouseenter', () => nav.classList.add('nav-hovering'));
      a.addEventListener('mouseleave', () => {
        // 延迟一点检查：如果是移到相邻的链接 → 相邻的 mouseenter 会立刻再加回来
        requestAnimationFrame(() => {
          const stillHovering = navLinks.some(l => l.matches(':hover'));
          if (!stillHovering) nav.classList.remove('nav-hovering');
        });
      });
    });
  }

  // 导航链接点击后5秒自动隐藏导航栏（桌面端 + 移动端通用）
  function bindNavAutoHide() {
    const nav = $('#navbar');
    const themeToggle = $('#themeToggle');
    if (!nav) return;

    let navAutoHideTimer = null;
    let navInteracted = false;
    let scrollInteractHandler = null;
    // 滚动静止检测相关
    let scrollStopCheckTimer = null;
    let scrollStopScrollHandler = null;
    // 兜底最长锁定/等待时间（应对极长距离滚动或用户持续手动滚动）
    const MAX_WAIT_MS = 4000;
    const SCROLL_IDLE_MS = 150; // 150ms 无新 scroll 事件 → 判定滚动已停稳

    function clearNavAutoHide() {
      if (navAutoHideTimer) {
        clearTimeout(navAutoHideTimer);
        navAutoHideTimer = null;
      }
      if (scrollInteractHandler) {
        window.removeEventListener('scroll', scrollInteractHandler, true);
        scrollInteractHandler = null;
      }
      if (scrollStopCheckTimer) {
        clearTimeout(scrollStopCheckTimer);
        scrollStopCheckTimer = null;
      }
      if (scrollStopScrollHandler) {
        window.removeEventListener('scroll', scrollStopScrollHandler, true);
        scrollStopScrollHandler = null;
      }
    }

    /**
     * 等待滚动静止（连续 SCROLL_IDLE_MS 没有新 scroll 事件触发）
     * 或者到 MAX_WAIT_MS 兜底超时。done 回调只会触发一次。
     */
    function waitForScrollStop(done) {
      let doneCalled = false;
      const finish = () => {
        if (doneCalled) return;
        doneCalled = true;
        clearTimeout(scrollStopCheckTimer);
        scrollStopCheckTimer = null;
        if (scrollStopScrollHandler) {
          window.removeEventListener('scroll', scrollStopScrollHandler, true);
          scrollStopScrollHandler = null;
        }
        done();
      };
      // 每次 scroll → 重置"静止检查"定时器
      scrollStopScrollHandler = () => {
        if (doneCalled) return;
        if (scrollStopCheckTimer) clearTimeout(scrollStopCheckTimer);
        scrollStopCheckTimer = setTimeout(finish, SCROLL_IDLE_MS);
      };
      window.addEventListener('scroll', scrollStopScrollHandler, { passive: true });
      // 兜底：4秒后无论如何都算停了，避免死等
      setTimeout(finish, MAX_WAIT_MS);
      // 立即先设一个初始检测，防止距离太短没触发 scroll（比如点击当前section链接）
      scrollStopCheckTimer = setTimeout(finish, SCROLL_IDLE_MS);
    }

    function startNavAutoHide() {
      clearNavAutoHide();
      navInteracted = false;

      // 1. 先强制显示导航栏 + 锁定滚动隐藏逻辑（兜底最长4秒，足够滚动到最底部）
      window.__navJumpLock?.(MAX_WAIT_MS);

      // 2. 等待平滑滚动真正停稳，才开始 5 秒倒计时
      waitForScrollStop(() => {
        // 滚动停稳后：如果期间已经触碰过 → 直接放弃自动隐藏
        if (navInteracted) return;

        navAutoHideTimer = setTimeout(() => {
          if (!navInteracted) {
            nav.classList.add('nav-hidden');
            themeToggle?.classList.add('btn-hidden');
          }
        }, 5000);

        // 停稳后才注册：再发生滚动 → 视为用户在看页面，取消自动隐藏
        scrollInteractHandler = () => onNavInteract();
        window.addEventListener('scroll', scrollInteractHandler, { passive: true, once: true });
      });
    }

    function onNavInteract() {
      navInteracted = true;
      clearNavAutoHide();
    }

    // 监听导航栏本身的触碰
    nav.addEventListener('mouseenter', onNavInteract);
    nav.addEventListener('touchstart', onNavInteract, { passive: true });

    // 绑定所有锚点导航链接（首页、关于、联系、文章、资源）
    $$('.nav-link').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) {
        a.addEventListener('click', () => startNavAutoHide());
      }
    });
  }

  // 汉堡菜单（移动端）
  function bindMobileNav() {
    const toggle = $('#navToggle');
    const links = $('#navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('show');
    });

    // 点击汉堡菜单里的链接 → 自动收起汉堡
    $$('.nav-link', links).forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('show');
    }));
  }

  // 处理社交卡点击
  function bindSocialCards() {
    $$('[data-action="qq"]').forEach(el => {
      el.addEventListener('click', async () => {
        const cfg = SOCIAL_CONFIG.qq;
        // 1. 通过QQ协议直接唤起QQ并跳转到加好友页面
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const protocolLink = isMobile
          ? `mqqapi://card/show_pslcard?src_type=internal&version=1&card_type=person&uin=${cfg.number}&source=qrcard`
          : `tencent://AddContact/?fromId=45&SubVer=51&uin=${cfg.number}&sourceId=13`;

        try {
          window.location.href = protocolLink;
        } catch { /* 忽略唤起错误 */ }

        // 2. 同时显示弹窗方便复制（如QQ未自动打开可手动操作）
        openLinkModal({
          headerIcon: 'fa-brands fa-qq',
          headerColor: '#12B7F5',
          title: '添加我的 QQ',
          desc: '已尝试唤起 QQ 加好友，如未自动打开可手动复制账号搜索添加',
          link: `QQ号：${cfg.number}\n加好友链接：${cfg.webLink}`,
          openText: '打开 QQ 网页版',
          openLink: cfg.webLink,
          openEnabled: cfg.webLink && !cfg.webLink.includes('你的')
        });
      });
    });

    $$('[data-action="wechat"]').forEach(el => {
      el.addEventListener('click', () => {
        $('#wechatIdText').textContent = SOCIAL_CONFIG.wechat.id;
        openModal('wechatModal');
      });
    });

    // 快手：PC端复制+跳转首页手动搜，移动端直跳主页
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    $$('[data-action="kuaishou"]').forEach(el => {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const cfg = SOCIAL_CONFIG.kuaishou;
        if (isMobileDevice) {
          showToast('正在打开快手主页…');
          const win = window.open(cfg.homePage, '_blank');
          if (!win) window.location.href = cfg.homePage;
        } else {
          const ok = await copyText(cfg['快手号']);
          if (ok) {
            showToast(`已复制快手号 ${cfg['快手号']}，即将跳转快手首页…请在搜索框粘贴`);
            setTimeout(() => {
              const win = window.open('https://www.kuaishou.com', '_blank');
              if (!win) window.location.href = 'https://www.kuaishou.com';
            }, 400);
          } else {
            showToast('复制失败，请手动复制快手号：' + cfg['快手号'], true);
          }
        }
      });
    });

    // 快手卡片"访问主页"按钮：PC端复制+跳转首页，移动端直跳
    $$('.social-kuaishou .social-action').forEach(el => {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        const cfg = SOCIAL_CONFIG.kuaishou;
        if (isMobileDevice) {
          showToast('正在打开快手主页…');
          const win = window.open(cfg.homePage, '_blank');
          if (!win) window.location.href = cfg.homePage;
        } else {
          const ok = await copyText(cfg['快手号']);
          if (ok) {
            showToast(`已复制快手号 ${cfg['快手号']}，即将跳转快手首页…请在搜索框粘贴`);
            setTimeout(() => {
              const win = window.open('https://www.kuaishou.com', '_blank');
              if (!win) window.location.href = 'https://www.kuaishou.com';
            }, 400);
          } else {
            showToast('复制失败，请手动复制快手号：' + cfg['快手号'], true);
          }
        }
      });
    });

    // 复制微信号按钮
    $('#copyWechatBtn')?.addEventListener('click', async () => {
      const id = SOCIAL_CONFIG.wechat.id;
      const ok = await copyText(id);
      showToast(ok ? `微信号 ${id} 已复制` : '复制失败，请手动长按复制', !ok);
    });

    // 点击账号复制（QQ号 / 微信号 / 快手号 / 抖音号 / 页脚联系方式）
    bindCopyButtons();

    // App 唤起按钮：尝试 deep link 唤起客户端；首次失败变"重试"，重试仍失败变"去应用商店"
    $$('.app-wake-btn').forEach(btn => {
      const originalText = btn.textContent;
      let resetTimer = null;
      let failCount = 0; // 连续失败次数，成功后清零

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const app = btn.dataset.app;
        const cfg = SOCIAL_CONFIG[app];
        if (!cfg || !cfg.appScheme) return;
        const name = { kuaishou: '快手', douyin: '抖音', qq: 'QQ', wechat: '微信' }[app] || app;
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        clearTimeout(resetTimer);

        // 备选方案：按钮处于"去应用商店"态时，点击直接跳转商店下载
        if (btn.classList.contains('app-wake-store')) {
          if (!cfg.storeUrl) return;
          const storeUrl = typeof cfg.storeUrl === 'function' ? cfg.storeUrl() : cfg.storeUrl;
          showToast(`正在跳转${name}应用商店…`);
          const win = window.open(storeUrl, '_blank');
          if (!win) window.location.href = storeUrl; // 内嵌浏览器拦截 _blank 时回退
          resetTimer = setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('app-wake-store');
            failCount = 0;
          }, 1500);
          return;
        }

        const scheme = typeof cfg.appScheme === 'function' ? cfg.appScheme() : cfg.appScheme;
        showToast(`正在尝试打开${name} App…`);
        btn.textContent = '唤起中…';
        btn.classList.add('app-wake-loading');
        btn.classList.remove('app-wake-fail', 'app-wake-store');

        // 多信号检测唤起成功：visibilitychange / pagehide / window blur
        // 仅 document.hidden 不可靠：iOS 弹"是否打开 App"确认框耗时、部分内嵌浏览器不触发隐藏
        let resolved = false;
        let failTimer = null;
        let blurCheckTimer = null;

        const cleanup = () => {
          document.removeEventListener('visibilitychange', onVis);
          document.removeEventListener('webkitvisibilitychange', onVis);
          window.removeEventListener('pagehide', onSuccess);
          window.removeEventListener('blur', onBlur);
          clearTimeout(failTimer);
          clearTimeout(blurCheckTimer);
        };
        const onSuccess = () => {
          if (resolved) return;
          resolved = true;
          cleanup();
          failCount = 0; // 成功清零
          btn.textContent = originalText;
          btn.classList.remove('app-wake-loading', 'app-wake-fail', 'app-wake-store');
        };
        // 信号1：页面隐藏（标准移动端 App 拉起信号）
        const onVis = () => { if (document.hidden) onSuccess(); };
        // 信号2：页面卸载（部分浏览器跳转 App 时触发）
        // 信号3：窗口失焦（PC 桌面端、部分内嵌浏览器 hidden 不变但失焦）
        const onBlur = () => {
          // 延迟二次确认：排除 location.href 跳转瞬间抖动、iOS 系统弹窗前的短暂失焦
          clearTimeout(blurCheckTimer);
          blurCheckTimer = setTimeout(() => {
            if (!document.hasFocus()) onSuccess();
          }, 400);
        };

        // 先注册监听再触发唤起，避免极快拉起时错过事件
        document.addEventListener('visibilitychange', onVis);
        document.addEventListener('webkitvisibilitychange', onVis);
        window.addEventListener('pagehide', onSuccess);
        window.addEventListener('blur', onBlur);

        window.location.href = scheme;

        failTimer = setTimeout(() => {
          if (!resolved) {
            cleanup();
            if (isMobile) {
              failCount += 1;
              if (failCount >= 2 && cfg.storeUrl) {
                // 重试后仍失败：进入"去应用商店"态（第四态，积极引导下载）
                btn.textContent = '仍未唤起？去应用商店';
                btn.classList.remove('app-wake-loading', 'app-wake-fail');
                btn.classList.add('app-wake-store');
                showToast(`未检测到${name} App，点击前往应用商店下载`, true);
                resetTimer = setTimeout(() => {
                  btn.textContent = originalText;
                  btn.classList.remove('app-wake-store');
                  failCount = 0;
                }, 10000);
              } else {
                // 首次失败：显示重试
                btn.textContent = '未唤起？点此重试';
                btn.classList.remove('app-wake-loading', 'app-wake-store');
                btn.classList.add('app-wake-fail');
                showToast(`未检测到${name} App？请点此重试或确认已安装`, true);
                resetTimer = setTimeout(() => {
                  btn.textContent = originalText;
                  btn.classList.remove('app-wake-fail');
                  failCount = 0;
                }, 10000);
              }
            } else {
              // PC 端：桌面 App 不触发页面隐藏，无法可靠检测，恢复默认并提示
              btn.textContent = originalText;
              btn.classList.remove('app-wake-loading');
              showToast(`若${name} App 未打开，请确认已安装`, true);
            }
          }
        }, 4000);
      });
    });
  }

  // 通用链接弹窗
  function openLinkModal({ headerIcon = 'fa-link', headerColor, title, desc, link, openText = '打开链接', openLink, openEnabled = true }) {
    const headerIconEl = $('#linkModalHeader i');
    if (headerIconEl) {
      headerIconEl.className = 'fa-solid ' + headerIcon;
      if (headerColor) {
        headerIconEl.parentElement.querySelector('i').style.background = headerColor + '22';
        headerIconEl.parentElement.querySelector('i').style.color = headerColor;
      }
    }
    $('#linkModalTitle').textContent = title;
    $('#linkModalDesc').textContent = desc || '';
    $('#linkBoxText').textContent = link;
    const openBtn = $('#linkOpenBtn');
    if (openEnabled && openLink) {
      openBtn.style.display = 'inline-flex';
      openBtn.href = openLink;
      openBtn.firstChild?.nextSibling && (openBtn.lastChild.textContent = ' ' + openText);
    } else {
      openBtn.style.display = 'none';
    }
    $('#linkCopyBtn').onclick = async () => {
      const ok = await copyText(link);
      showToast(ok ? '链接已复制到剪贴板' : '复制失败，请手动长按复制', !ok);
    };
    openModal('linkModal');
  }

  // 资源卡按钮
  function bindResourceCards() {
    $('#resourcesGrid').addEventListener('click', async (e) => {
      const btnOpen = e.target.closest('[data-action="open-resource"]');
      const btnCopy = e.target.closest('[data-action="copy-resource"]');
      if (btnOpen) {
        const link = btnOpen.dataset.link;
        if (!link || link.includes('示例')) {
          showToast('链接为演示数据，请在 script.js RESOURCES 数组中配置真实链接', true);
          return;
        }
        // 新窗口打开
        window.open(link, '_blank', 'noopener');
        // 同时弹窗展示提取码
        const title = btnOpen.dataset.title || '';
        const desc = btnOpen.dataset.desc || '';
        // 从资源数据里找回完整链接+提取码
        const full = RESOURCES.find(r => r.title === title.split(' · ')[0]);
        const fullLink = full
          ? (full.code && full.code !== '无需提取码' ? `${full.link}\n提取码：${full.code}` : full.link)
          : link;
        setTimeout(() => openLinkModal({
          headerIcon: 'fa-cloud',
          headerColor: '#E67E52',
          title: title,
          desc: desc + ' · 如页面关闭可在此复制完整信息',
          link: fullLink,
          openText: '重新打开',
          openLink: link,
          openEnabled: true
        }), 400);
      }
      if (btnCopy) {
        const link = btnCopy.dataset.link;
        const name = btnCopy.dataset.name || '';
        if (link.includes('示例')) {
          showToast('链接为演示数据，请在 script.js 的 RESOURCES 中配置真实网盘链接', true);
          return;
        }
        const ok = await copyText(link);
        showToast(ok ? (name ? name + ' 链接与提取码已复制' : '链接已复制') : '复制失败，请手动长按复制', !ok);
      }
    });
  }

  // 文章步进显示：增量增删卡片，带进入/淡出动画
  function renderBlogVisible() {
    const grid = $('#blogGrid');
    if (!grid) return;
    const desired = blogVisibleCount;
    const current = grid.querySelectorAll('.blog-card').length;
    if (desired > current) {
      // 增量追加新卡片（进入动画由 CSS 自动播放）
      const newPosts = ALL_BLOG_POSTS.slice(current, desired);
      const html = newPosts.map(buildBlogCard).join('');
      grid.insertAdjacentHTML('beforeend', html);
      // 交错延迟：每张卡片依次进入，产生波浪效果
      const newCards = grid.querySelectorAll('.blog-card');
      for (let i = current; i < newCards.length; i++) {
        newCards[i].style.animationDelay = (i - current) * 0.08 + 's';
      }
      updateBlogButtons();
    } else if (desired < current) {
      // 移除多余卡片：先淡出再移除（从前往后收纳，后面卡片先消失）
      const cards = Array.from(grid.querySelectorAll('.blog-card'));
      const toRemove = cards.slice(desired);
      const removeCount = toRemove.length;
      toRemove.forEach((c, i) => {
        c.style.animationDelay = (removeCount - 1 - i) * 0.08 + 's';
        c.classList.add('blog-card-removing');
      });
      updateBlogButtons();
      const maxDelay = (removeCount - 1) * 0.08 + 0.5;
      setTimeout(() => {
        toRemove.forEach(c => c.remove());
      }, maxDelay * 1000);
    } else {
      updateBlogButtons();
    }
  }

  // 更新"加载更多 / 收纳"按钮状态
  function updateBlogButtons() {
    const moreBtn = $('#loadMoreBtn');
    const collapseBtn = $('#collapseBlogBtn');
    const total = ALL_BLOG_POSTS.length;
    const initial = BLOG_MQ.matches ? BLOG_INITIAL_MOBILE : BLOG_INITIAL_DESKTOP;
    if (moreBtn) {
      if (blogVisibleCount >= total) {
        moreBtn.innerHTML = '<i class="fa-solid fa-flag"></i>&nbsp; 已经到底啦';
        moreBtn.disabled = true;
        moreBtn.style.opacity = '0.6';
      } else {
        moreBtn.innerHTML = '<i class="fa-solid fa-angles-down"></i>&nbsp; 加载更多文章';
        moreBtn.disabled = false;
        moreBtn.style.opacity = '';
      }
    }
    if (collapseBtn) collapseBtn.hidden = blogVisibleCount <= initial;
  }

  // 关于我四个卡片：点击动态效果（水涟漪 + 弹性回弹 + 图标专属抖动，4 张风格不同）
  // 参考经验 1089730：单一变换源（全走 CSS）+ 所有定时器集中清理，避免残留冲突
  function bindAboutCardClick() {
    const cards = $$('.about-card');
    if (!cards.length) return;

    // DOM 顺序 → 图标抖动风格映射（和 CSS 中 about-icon 的 4 个 variant 一致）
    // [0] 我是谁   → heartBeat 心跳
    // [1] 博客内容 → wobble    左右晃
    // [2] 兴趣爱好 → spinTilt  旋转倾斜
    // [3] 今年X岁  → bounceUp  上下弹
    const variants = ['heart', 'wobble', 'spin', 'bounce'];
    // 每个 variant 的图标动画时长（毫秒），popTimer 在此基础上 +60ms 缓冲，避免动画最后一帧被截断
    const variantDuration = { heart: 720, wobble: 720, spin: 680, bounce: 760 };

    // 每张卡片独立的 timers 池，避免 pointerdown/up 快速连点残留 timer 导致 class 错乱
    const cardTimers = new WeakMap();
    cards.forEach((card, idx) => {
      cardTimers.set(card, []);
      // 给卡片挂专属 variant：如果卡片数超过 4，用取模循环
      const variant = variants[idx % variants.length];
      card.classList.add('icon-variant-' + variant);
      card.dataset.iconVariant = variant;
    });

    const clearCardTimers = (card) => {
      const timers = cardTimers.get(card);
      if (!timers) return;
      timers.forEach(id => clearTimeout(id));
      timers.length = 0;
    };

    cards.forEach(card => {
      const variant = card.dataset.iconVariant;
      // 清理 card-tap-pop 的时间：最长 variant 的动画时长 + 缓冲
      const popDuration = (variantDuration[variant] ?? 760) + 60;

      // -------- pointerdown：创建涟漪（点击位置） --------
      card.addEventListener('pointerdown', (e) => {
        // 命中内部按钮/链接/表单控件：让它们自己处理，不触发卡片涟漪（防止与按钮点击效果重叠）
        if (e.target.closest('a, button, [role="button"], input, textarea, select')) return;

        const rect = card.getBoundingClientRect();
        // 若取不到 pageX（触控/边缘情况），默认卡片中心
        const x = (typeof e.clientX === 'number' ? e.clientX : (rect.left + rect.width / 2)) - rect.left;
        const y = (typeof e.clientY === 'number' ? e.clientY : (rect.top + rect.height / 2)) - rect.top;
        const size = Math.max(rect.width, rect.height) * 0.85;

        const ripple = document.createElement('span');
        ripple.className = 'card-ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (x - size / 2) + 'px';
        ripple.style.top  = (y - size / 2) + 'px';
        card.appendChild(ripple);

        // 动画 0.7s 后移除；记录 timer 以便连点清理
        const timers = cardTimers.get(card);
        const rmTimer = setTimeout(() => {
          if (ripple.parentNode === card) ripple.remove();
          const idx = timers.indexOf(rmTimer);
          if (idx >= 0) timers.splice(idx, 1);
        }, 750);
        timers.push(rmTimer);
      });

      // -------- pointerup / click：弹性回弹动画 --------
      const runTapPop = (e) => {
        if (e && e.target && e.target.closest('a, button, [role="button"], input, textarea, select')) return;
        // 先清掉上次残留：移除 class、清理所有挂起的 timer
        clearCardTimers(card);
        // 重启动画（移除再添加，触发 reflow）
        card.classList.remove('card-tap-pop');
        // eslint-disable-next-line no-unused-expressions
        void card.offsetWidth;
        card.classList.add('card-tap-pop');

        const timers = cardTimers.get(card);
        // 动画结束后移除 class：使用各 variant 的专属时长，保证图标最后一帧完整播完
        const popTimer = setTimeout(() => {
          card.classList.remove('card-tap-pop');
          const idx = timers.indexOf(popTimer);
          if (idx >= 0) timers.splice(idx, 1);
        }, popDuration);
        timers.push(popTimer);
      };

      // 桌面端：pointerup 触发；触屏/特殊情况 click 兜底（但避免同一个按压触发两次：用 pointerdown 时间戳锁）
      card.addEventListener('pointerup', (e) => {
        card.__tapLockUntil = Date.now() + 120;
        runTapPop(e);
      });
      card.addEventListener('click', (e) => {
        if (card.__tapLockUntil && Date.now() < card.__tapLockUntil) return;
        runTapPop(e);
      });

      // 卡片被销毁或离开页面时清理（pointercancel 也清）
      card.addEventListener('pointercancel', () => clearCardTimers(card));
    });
  }

  // 生日祝福按钮 + 蛋糕掉落特效
  function bindBirthdayBless() {
    const btn = $('#birthdayBlessBtn');
    const wish = $('#birthdayWish');
    const container = $('#cakeContainer');
    if (!btn) return;

    const wishes = [
      '愿你的每一天都充满阳光和欢笑 🎉',
      '愿所有美好如约而至，生日快乐！🎂',
      '愿你被这世界温柔以待，永远年轻 🌟',
      '愿你的愿望都能实现，幸福常伴左右 ✨',
      '愿时光温柔，岁月静好，生日快乐！🎈',
      '愿你眼里有光，心中有暖，不负韶华 💝'
    ];

    btn.addEventListener('click', () => {
      // 显示祝福文字
      const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
      wish.innerHTML = `
        <div class="birthday-wish-inner">
          <h4>🎂 提前祝你生日快乐！</h4>
          <p>${randomWish}</p>
          <p class="wish-sign">—— 来自你的小粉丝 💕</p>
        </div>
      `;
      wish.classList.add('show');

      // 按钮反馈
      btn.innerHTML = '<i class="fa-solid fa-heart"></i>&nbsp; 祝福你 ❤️';
      btn.style.pointerEvents = 'none';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-gift"></i>&nbsp; 🎂 庆庆纸生日快乐 🎂';
        btn.style.pointerEvents = 'auto';
      }, 3000);

      // 生成蛋糕掉落特效
      spawnCakes(container);
      spawnConfetti(container);
    });
  }

  // 生成蛋糕掉落
  function spawnCakes(container) {
    if (!container) return;
    const emojis = ['🎂', '🎂', '🍰', '🧁', '🍩', '🎁', '🎈', '🎉'];
    const count = 25 + Math.floor(Math.random() * 15);

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const cake = document.createElement('div');
        cake.className = 'cake spin';
        cake.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        cake.style.left = Math.random() * 100 + 'vw';
        cake.style.fontSize = (2 + Math.random() * 2.5) + 'rem';
        const duration = 2.5 + Math.random() * 3;
        cake.style.animationDuration = duration + 's';
        const delay = Math.random() * 0.5;
        cake.style.animationDelay = delay + 's';
        container.appendChild(cake);

        setTimeout(() => {
          if (cake.parentNode === container) {
            container.removeChild(cake);
          }
        }, (duration + delay) * 1000 + 100);
      }, i * 80);
    }
  }

  // 生成彩色纸屑
  function spawnConfetti(container) {
    if (!container) return;
    const colors = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
    const count = 60;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const conf = document.createElement('div');
        conf.className = 'confetti ' + colors[Math.floor(Math.random() * colors.length)];
        conf.style.left = Math.random() * 100 + 'vw';
        const duration = 2 + Math.random() * 2.5;
        conf.style.animationDuration = duration + 's';
        const delay = Math.random() * 0.5;
        conf.style.animationDelay = delay + 's';
        const size = 6 + Math.random() * 8;
        conf.style.width = size + 'px';
        conf.style.height = (size * 1.4) + 'px';
        container.appendChild(conf);

        setTimeout(() => {
          if (conf.parentNode === container) {
            container.removeChild(conf);
          }
        }, (duration + delay) * 1000 + 100);
      }, i * 30);
    }
  }

  // 文章加载更多 / 收纳
  function bindLoadMore() {
    const moreBtn = $('#loadMoreBtn');
    const collapseBtn = $('#collapseBlogBtn');
    if (!moreBtn) return;
    moreBtn.addEventListener('click', () => {
      if (blogVisibleCount >= ALL_BLOG_POSTS.length) {
        showToast('已经到底啦～更多文章正在准备中');
        return;
      }
      blogExpandScrollY = window.scrollY;
      const step = BLOG_MQ.matches ? BLOG_STEP_MOBILE : BLOG_STEP_DESKTOP;
      const prevCount = blogVisibleCount;
      const wasAtEnd = blogVisibleCount >= ALL_BLOG_POSTS.length;
      blogVisibleCount = Math.min(blogVisibleCount + step, ALL_BLOG_POSTS.length);
      renderBlogVisible();
      const moreBtn = $('#loadMoreBtn');
      const isNowAtEnd = blogVisibleCount >= ALL_BLOG_POSTS.length;
      if (moreBtn && !wasAtEnd && isNowAtEnd) {
        moreBtn.classList.add('fade-out');
        setTimeout(() => {
          moreBtn.classList.remove('fade-out', 'fade-in');
          moreBtn.classList.add('fade-in');
        }, 400);
      }
      const grid = $('#blogGrid');
      if (grid) {
        const scrollToIdx = prevCount;
        const scrollDelay = Math.min(0.35, (step - 1) * 0.08 + 0.15);
        setTimeout(() => {
          const cards = grid.querySelectorAll('.blog-card');
          const firstNew = cards[scrollToIdx];
          if (firstNew) {
            const rect = firstNew.getBoundingClientRect();
            const targetTop = window.innerHeight * 0.12;
            const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 80;
            window.scrollTo({
              top: window.scrollY + rect.top - targetTop,
              behavior: 'smooth'
            });
          }
        }, scrollDelay * 1000);
      }
      showToast(`已展开至 ${blogVisibleCount} 篇文章`);
    });
    collapseBtn?.addEventListener('click', () => {
      const step = BLOG_MQ.matches ? 2 : 3;
      const initial = BLOG_MQ.matches ? BLOG_INITIAL_MOBILE : BLOG_INITIAL_DESKTOP;
      const prevCount = blogVisibleCount;
      blogVisibleCount = Math.max(initial, blogVisibleCount - step);
      const newFirstIdx = blogVisibleCount - 1;
      const scrollDelay = Math.min(0.35, (prevCount - blogVisibleCount - 1) * 0.08 + 0.15);
      renderBlogVisible();
      const grid = $('#blogGrid');
      if (grid) {
        setTimeout(() => {
          const cards = grid.querySelectorAll('.blog-card');
          const targetCard = cards[newFirstIdx];
          if (targetCard) {
            const rect = targetCard.getBoundingClientRect();
            const targetTop = window.innerHeight * 0.12;
            const scrollTarget = window.scrollY + rect.top - targetTop;
            window.scrollTo({
              top: Math.min(scrollTarget, window.scrollY),
              behavior: 'smooth'
            });
          }
        }, scrollDelay * 1000);
      }
      showToast(`已收纳 ${step} 篇文章`);
    });
    // 响应式：断点切换时重置为对应初始数并重渲染
    const onMQChange = () => {
      blogVisibleCount = BLOG_MQ.matches ? BLOG_INITIAL_MOBILE : BLOG_INITIAL_DESKTOP;
      renderBlogVisible();
    };
    if (BLOG_MQ.addEventListener) BLOG_MQ.addEventListener('change', onMQChange);
    else BLOG_MQ.addListener(onMQChange);
  }

  /* ---------- 樱花飘落特效 ---------- */
  function initSakura() {
    const canvas = document.createElement('canvas');
    canvas.className = 'sakura-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let petals = [];
    let animationId = null;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // 根据屏幕宽度调整花瓣数量（移动端少一些以保证性能）
    function getPetalCount() {
      const w = window.innerWidth;
      if (w <= 430) return 15;
      if (w <= 768) return 25;
      if (w <= 1080) return 35;
      return 45;
    }

    function createPetal(fromTop) {
      return {
        x: Math.random() * canvas.width,
        y: fromTop ? -20 - Math.random() * 100 : Math.random() * canvas.height,
        size: Math.random() * 6 + 5,
        speedY: Math.random() * 1.2 + 0.4,
        speedX: Math.random() * 0.6 - 0.3,
        sway: Math.random() * 2 + 1,
        swaySpeed: Math.random() * 0.015 + 0.008,
        swayOffset: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.4 + 0.4,
        hue: Math.random() * 20 - 10
      };
    }

    function initPetals() {
      const count = getPetalCount();
      petals = [];
      for (let i = 0; i < count; i++) petals.push(createPetal(false));
    }

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;
      const size = p.size;
      // 樱花粉色花瓣
      ctx.fillStyle = `hsl(${340 + p.hue}, 70%, 85%)`;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.5, -size * 0.8, size * 0.5, size * 0.3, 0, size);
      ctx.bezierCurveTo(-size * 0.5, size * 0.3, -size * 0.5, -size * 0.8, 0, -size);
      ctx.fill();
      // 花瓣顶端凹口
      ctx.fillStyle = `hsl(${340 + p.hue}, 60%, 92%)`;
      ctx.beginPath();
      ctx.arc(0, -size * 0.65, size * 0.13, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += Math.sin(p.swayOffset + p.y * p.swaySpeed) * p.sway * 0.3 + p.speedX;
        p.angle += p.rotation;
        if (p.y > canvas.height + 20 || p.x < -30 || p.x > canvas.width + 30) {
          petals[i] = createPetal(true);
        }
        drawPetal(p);
      }
      animationId = requestAnimationFrame(animate);
    }

    // 页面切到后台时暂停动画（节省性能）
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
      } else {
        if (!animationId) animate();
      }
    });

    resize();
    initPetals();
    animate();

    let resizeTimer;
    window.addEventListener('resize', () => {
      resize();
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initPetals, 300);
    });
  }

  /* ---------- 音乐播放器 ---------- */
  async function initMusicPlayer() {
    const player = document.getElementById('musicPlayer');
    const collapsed = document.getElementById('musicCollapsed');
    const titleEl = document.getElementById('musicTitle');
    const artistEl = document.getElementById('musicArtist');
    const coverEl = document.getElementById('musicCover');
    const playBtn = document.getElementById('musicPlay');
    const prevBtn = document.getElementById('musicPrev');
    const nextBtn = document.getElementById('musicNext');
    const progressEl = document.getElementById('musicProgress');
    const progressBar = document.getElementById('musicProgressBar');
    const curTimeEl = document.getElementById('musicCurTime');
    const remTimeEl = document.getElementById('musicRemTime');
    const countdownEl = document.getElementById('musicCollapseCountdown');
    const loopBtn = document.getElementById('musicLoop');
    const collapseBtn = document.getElementById('musicCollapseBtn');
    const listBtn = document.getElementById('musicList');
    const playlistList = document.getElementById('musicPlaylistList');
    const playlistEmpty = document.getElementById('musicPlaylistEmpty');
    // 收起态小圆形元素
    const collapsedCover = document.getElementById('musicCollapsedCover');
    // 收起态右下角的播放/暂停小图标已移除（用户不再需要）
    const collapsedPlay = null;

    if (!player) return;

    // 从 ./music/playlist.json 加载项目目录里的歌曲
    // 若 fetch 失败（例如直接双击 index.html 用 file:// 协议访问），则 fallback 到内置默认列表
    const DEFAULT_PLAYLIST = [
      { title: 'Memories', artist: 'Maroon 5', src: './music/Memories.mp3' },
      { title: '你赢了兄弟', artist: '-', src: './music/你赢了兄弟.mp3' }
    ];
    let manifest = [];
    try {
      const resp = await fetch('./music/playlist.json', { cache: 'no-cache' });
      if (resp.ok) {
        manifest = await resp.json();
      } else {
        console.warn(`playlist.json 加载失败 (HTTP ${resp.status})，使用内置默认列表`);
        manifest = DEFAULT_PLAYLIST;
      }
    } catch (err) {
      console.warn('无法 fetch music/playlist.json（可能是 file:// 协议直接打开了 index.html），使用内置默认列表', err);
      manifest = DEFAULT_PLAYLIST;
    }
    const runtimePlaylist = (Array.isArray(manifest) && manifest.length ? manifest : DEFAULT_PLAYLIST).map(s => ({
      title: s.title || '未知歌曲',
      artist: s.artist || '-',
      src: s.src
    }));

    if (!runtimePlaylist.length) {
      titleEl.textContent = '暂无歌曲';
      artistEl.textContent = '编辑 music/playlist.json 添加';
      renderPlaylist();
      syncCollapsedUi();
      return;
    }

    const audio = new Audio();
    audio.preload = 'auto';

    let currentIndex = 0;
    let isPlaying = false;
    let pendingPlay = false; // 音频源未就绪时标记待播放，loadSong 完成后自动开始
    let collapseTimer = null;
    let hasInteracted = false;
    // 循环模式：'sequence' = 顺序播放，'single' = 单曲循环；从 localStorage 读取偏好
    let loopMode = (() => {
      try {
        const saved = localStorage.getItem('musicLoopMode');
        return saved === 'single' ? 'single' : 'sequence';
      } catch (_) { return 'sequence'; }
    })();
    // 单曲循环的次数：1 / 3 / 5 / Infinity（无限），点击循环按钮按此序列切换
    const LOOP_COUNT_ORDER = [1, 3, 5, Infinity];
    let loopCount = (() => {
      try {
        const saved = localStorage.getItem('musicLoopCount');
        if (saved === 'Infinity' || saved === null) return Infinity;
        const n = parseInt(saved, 10);
        return LOOP_COUNT_ORDER.includes(n) ? n : Infinity;
      } catch (_) { return Infinity; }
    })();
    // 当前歌曲剩余的循环次数：每次切歌（loadSong）重置为 loopCount；Infinity 表示永不耗尽
    let remainingLoops = loopCount;

    // 从 mp3 文件的 ID3v2 标签里提取内嵌封面（APIC 帧）
    // 没有内嵌封面时返回 null，调用方 fallback 到默认 CD 图标
    async function extractMp3Cover(url) {
      try {
        const resp = await fetch(url);
        if (!resp.ok) return null;
        const buf = new Uint8Array(await resp.arrayBuffer());
        // ID3v2 header: "ID3" + version(1) + flags(1) + size(4 syncsafe)
        if (buf.length < 10 || buf[0] !== 0x49 || buf[1] !== 0x44 || buf[2] !== 0x33) return null;
        const version = buf[3];
        const tagSize = ((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f);
        const tagEnd = Math.min(10 + tagSize, buf.length);
        let pos = 10;
        while (pos + 10 <= tagEnd) {
          // 帧头全是 0 表示到 padding，结束
          if (buf[pos] === 0) break;
          const frameId = String.fromCharCode(buf[pos], buf[pos+1], buf[pos+2], buf[pos+3]);
          // 帧大小：v2.4 必为 syncsafe；v2.3 实现不一致，两种都可能
          // 同时计算两种 size，选落在剩余 tag 范围内那个，提高兼容性
          const syncsafe = ((buf[pos+4] & 0x7f) << 21) | ((buf[pos+5] & 0x7f) << 14) | ((buf[pos+6] & 0x7f) << 7) | (buf[pos+7] & 0x7f);
          const normal32 = (buf[pos+4] * 0x1000000) + (buf[pos+5] << 16) + (buf[pos+6] << 8) + buf[pos+7];
          const remaining = tagEnd - pos - 10;
          let frameSize;
          if (version === 4) {
            frameSize = syncsafe;
          } else if (syncsafe <= remaining && normal32 > remaining) {
            frameSize = syncsafe; // v2.3 syncsafe 写法
          } else {
            frameSize = normal32; // v2.3 普通 32 位写法
          }
          pos += 10; // 跳过帧头
          if (frameId === 'APIC') {
            const encoding = buf[pos];
            // MIME: null-terminated ASCII
            let mimeEnd = pos + 1;
            while (mimeEnd < tagEnd && buf[mimeEnd] !== 0) mimeEnd++;
            const mime = new TextDecoder('ascii').decode(buf.subarray(pos + 1, mimeEnd));
            const picType = buf[mimeEnd + 1]; // 0x03 = front cover
            // 描述字段：encoding 0/3 单字节 null，1/2 双字节 null
            let descStart = mimeEnd + 2;
            let picStart;
            if (encoding === 1 || encoding === 2) {
              // UTF-16，双字节 null 终止
              let d = descStart;
              while (d + 1 < tagEnd && !(buf[d] === 0 && buf[d+1] === 0)) d += 2;
              picStart = d + 2;
            } else {
              let d = descStart;
              while (d < tagEnd && buf[d] !== 0) d++;
              picStart = d + 1;
            }
            const picData = buf.subarray(picStart, pos + frameSize);
            return URL.createObjectURL(new Blob([picData], { type: mime || 'image/jpeg' }));
          }
          pos += frameSize;
        }
        return null;
      } catch (err) {
        console.warn('提取封面失败:', url, err);
        return null;
      }
    }

    // 当前封面 Blob URL（切歌时释放，避免内存泄漏）
    let currentCoverUrl = null;
    // 收起态封面 Blob URL（单独存，防止和展开态共用同一个 URL 重复释放）
    let collapsedCoverUrl = null;
    // 当前整首音频的 Blob URL（切歌时释放）。
    // 背景：HSK 静态托管不支持 Range 请求，<audio> 拖动 seek 到未缓冲区域时
    // 浏览器会重新从头下载（表现为"从零播放"）。对策：把整首 mp3 拉取为 Blob
    // 再播放，seek 完全走本地数据，不再依赖服务器 Range 支持。
    let currentAudioUrl = null;

    // 把秒数格式化为「m:ss」，负数用于剩余时间显示（-2:45）
    function formatTime(sec) {
      if (!isFinite(sec) || isNaN(sec) || sec < 0) sec = 0;
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${String(s).padStart(2, '0')}`;
    }

    // 进度条 + 左已播放时间 + 右总时长 三者同步更新（注：右侧已从"剩余"改为"总时长"）
    // isPreview=true 时表示是拖拽预览写回，不做过渡动画，避免 UI 与 timeupdate 竞争
    function updateMusicProgress(isPreview = false) {
      const dur = audio.duration;
      const cur = audio.currentTime || 0;
      if (dur && isFinite(dur)) {
        const pct = Math.min(100, Math.max(0, cur / dur * 100));
        if (isPreview) {
          const prev = progressBar.style.transition;
          progressBar.style.transition = 'none';
          progressBar.style.width = pct + '%';
          // 下一帧恢复过渡：保证从预览态 → 自动更新是平滑的
          requestAnimationFrame(() => { progressBar.style.transition = prev; });
        } else {
          progressBar.style.width = pct + '%';
        }
        if (curTimeEl) curTimeEl.textContent = formatTime(cur);
        // 右侧改为总时长（正数 m:ss），不再是剩余负数
        if (remTimeEl) remTimeEl.textContent = formatTime(dur);
      } else {
        progressBar.style.width = '0%';
        if (curTimeEl) curTimeEl.textContent = '0:00';
        if (remTimeEl) remTimeEl.textContent = '0:00';
      }
    }

    // 同步循环按钮 UI：单曲循环 = 高亮 + 右下角次数 badge（1/3/5/∞） + 对应 aria/title
    function syncLoopUi() {
      if (!loopBtn) return;
      const isSingle = loopMode === 'single';
      loopBtn.classList.toggle('is-single', isSingle);
      if (isSingle) {
        const text = (loopCount === Infinity) ? '∞' : String(loopCount);
        loopBtn.setAttribute('data-count', text);
        const countLabel = (loopCount === Infinity) ? '无限' : loopCount + ' 次';
        const label = '播放模式：单曲循环（' + countLabel + '）';
        loopBtn.setAttribute('aria-label', label);
        loopBtn.setAttribute('title', label);
      } else {
        loopBtn.removeAttribute('data-count');
        const label = '播放模式：顺序播放';
        loopBtn.setAttribute('aria-label', label);
        loopBtn.setAttribute('title', label);
      }
    }

    function syncCollapsedUi() {
      // 收起态已是纯玻璃小圆（无单独播放按钮），只同步 playing 类（用于控制 mc-disc 旋转）
      player?.classList.toggle('playing', !!isPlaying);
    }

    async function loadSong(index) {
      const song = runtimePlaylist[index];
      if (!song) return;
      titleEl.textContent = song.title;
      artistEl.textContent = song.artist;
      // 重置进度条 + 左右时间文本
      updateMusicProgress();
      // 不再使用 audio.loop 原生循环：所有模式都靠 ended 事件驱动，
      // 这样单曲循环的「次数计数器」才能正确递减。
      audio.loop = false;
      // 切歌后重置剩余循环次数
      remainingLoops = loopCount;
      renderPlaylistActive();

      // 释放上一首的 Blob URL（旧歌数据已载入内存，释放不影响已缓冲的播放）
      if (currentAudioUrl) { URL.revokeObjectURL(currentAudioUrl); currentAudioUrl = null; }

      // 整首缓冲为 Blob 再播放：规避不支持 Range 请求的静态托管（HSK）导致拖动 seek 归零。
      // 拉取失败（file:// 或跨域等）时回退到直接 URL（本地环境仍可正常拖动）。
      let nextSrc = song.src;
      try {
        const resp = await fetch(song.src, { cache: 'force-cache' });
        if (resp.ok) {
          const blob = await resp.blob();
          currentAudioUrl = URL.createObjectURL(blob);
          nextSrc = currentAudioUrl;
        }
      } catch (err) { /* 回退直接 src */ }
      audio.src = nextSrc;
      // 若用户此前已点击过播放，音频源就绪后立即开始
      if (pendingPlay) { pendingPlay = false; play(); }

      // 重置封面，再尝试从 mp3 提取内嵌图
      // 新视觉：封面放在 .music-disc::before 内部，把 url 写到 CSS 变量里让伪元素 inherit/读取
      coverEl.style.removeProperty('background-image');
      coverEl.style.setProperty('--cover-url', 'none');
      coverEl.classList.remove('has-cover');
      if (currentCoverUrl) { URL.revokeObjectURL(currentCoverUrl); currentCoverUrl = null; }
      if (collapsedCover) {
        // 收起态封面也重置
        collapsedCover.style.removeProperty('background-image');
        collapsedCover.style.setProperty('--cover-url', 'none');
        const oldImg = collapsedCover.querySelector('img:not(.disc-icon)');
        if (oldImg) oldImg.remove();
      }
      if (collapsedCoverUrl) { URL.revokeObjectURL(collapsedCoverUrl); collapsedCoverUrl = null; }

      const coverUrl = await extractMp3Cover(song.src);
      if (coverUrl) {
        currentCoverUrl = coverUrl;
        // 写入 CSS 变量让 ::before 通过 url(var(--cover-url)) 使用（带回退引号，兼容 Chrome/Safari）
        const cssCoverUrl = `url("${coverUrl}")`;
        coverEl.style.setProperty('--cover-url', cssCoverUrl);
        coverEl.classList.add('has-cover');
        // 同步一份到收起态封面（用 clone 的 Blob 避免两个元素共用同一个被 revoked 的 blob url）
        if (collapsedCover) {
          try {
            const resp = await fetch(coverUrl);
            if (resp.ok) {
              const blob = await resp.blob();
              collapsedCoverUrl = URL.createObjectURL(blob);
              const cssCollapsedUrl = `url("${collapsedCoverUrl}")`;
              collapsedCover.style.setProperty('--cover-url', cssCollapsedUrl);
              // 收起态 mc-disc::before 也使用 CSS 变量 --cover-url（见样式文件）
              collapsedCover.style.backgroundImage = cssCollapsedUrl;
              const img = document.createElement('img');
              img.src = collapsedCoverUrl;
              img.alt = '';
              collapsedCover.appendChild(img);
            }
          } catch (_) { /* 忽略：失败就用默认唱片图标 */ }
        }
      }
      syncCollapsedUi();
    }

    function play() {
      // 音频源尚未就绪（loadSong 正在整首缓冲中）：标记待播放，src 就绪后由 loadSong 自动开始
      if (!audio.src) {
        pendingPlay = true;
        return;
      }
      pendingPlay = false;
      const p = audio.play();
      if (p && p.then) {
        p.then(() => {
          isPlaying = true;
          playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
          coverEl.classList.add('playing');
          renderPlaylistActive();
          syncCollapsedUi();
        }).catch(() => {
          // 浏览器阻止自动播放，等待用户交互
          isPlaying = false;
          playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
          coverEl.classList.remove('playing');
          syncCollapsedUi();
        });
      }
    }

    function pause() {
      pendingPlay = false;
      audio.pause();
      isPlaying = false;
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      coverEl.classList.remove('playing');
      renderPlaylistActive();
      syncCollapsedUi();
    }

    function togglePlay() {
      if (isPlaying) pause(); else play();
    }

    async function next() {
      currentIndex = (currentIndex + 1) % runtimePlaylist.length;
      await loadSong(currentIndex);
      play();
    }

    async function prev() {
      currentIndex = (currentIndex - 1 + runtimePlaylist.length) % runtimePlaylist.length;
      await loadSong(currentIndex);
      play();
    }

    // 渲染音乐目录列表
    function renderPlaylist() {
      const list = runtimePlaylist.map((song, i) => {
        const active = i === currentIndex;
        const playingIcon = active && isPlaying
          ? '<i class="fa-solid fa-compact-disc item-playing-icon"></i>'
          : '';
        return `
          <div class="music-playlist-item${active ? ' active' : ''}" data-idx="${i}">
            <span class="item-index">${i + 1}</span>
            <span class="item-title">${song.title}</span>
            ${playingIcon}
          </div>`;
      }).join('');
      playlistList.innerHTML = list;
      playlistEmpty.style.display = runtimePlaylist.length ? 'none' : 'block';
    }

    // 只更新高亮项（不重建整个列表，避免滚动跳动）
    function renderPlaylistActive() {
      playlistList.querySelectorAll('.music-playlist-item').forEach((el, i) => {
        const active = i === currentIndex;
        el.classList.toggle('active', active);
        const existing = el.querySelector('.item-playing-icon');
        if (active && isPlaying && !existing) {
          el.querySelector('.item-index').insertAdjacentHTML('afterend', '<i class="fa-solid fa-compact-disc item-playing-icon"></i>');
        } else if (!active && existing) {
          existing.remove();
        } else if (active && isPlaying && existing) {
          // 已存在，无需操作
        } else if (active && !isPlaying && existing) {
          existing.remove();
        }
      });
    }

    function collapse(autoOnly) {
      // 仅自动收起时若目录开着则延迟，手动收起一律生效
      if (autoOnly && player.classList.contains('show-playlist')) {
        // 停止倒计时动画，等待目录关闭后重新计时
        stopCountdownAnimation();
        collapseTimer = setTimeout(() => collapse(true), COLLAPSE_DELAY);
        return;
      }

      // 停止倒计时动画
      stopCountdownAnimation();

      const expanded = player.querySelector('.music-player-expanded');
      if (!expanded) { player.classList.add('collapsed'); return; }

      // 计算小图标按钮中心相对于卡片的偏移
      const expandedRect = expanded.getBoundingClientRect();
      const collapsedRect = collapsed.getBoundingClientRect();
      const originX = collapsedRect.left + collapsedRect.width / 2 - expandedRect.left;
      const originY = collapsedRect.top + collapsedRect.height / 2 - expandedRect.top;

      // 用内联样式设置 transform-origin 为小图标按钮中心
      // 实现展开和收起都在同一个位置（橡皮筋效果）
      expanded.style.transformOrigin = originX + 'px ' + originY + 'px';

      // 移除可能残留的内联 transform，让 CSS 控制缩放
      expanded.style.removeProperty('transform');

      // 清除展开位置保存，确保下次展开时从小图标当前位置开始
      localStorage.removeItem('musicExpandedPos');

      player.classList.add('collapsed');
      player.classList.remove('show-playlist');
      listBtn.classList.remove('active-toggle');
    }

    function expand() {
      const expanded = player.querySelector('.music-player-expanded');
      if (!expanded) return;

      const rect = collapsed.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // 计算导航栏底部安全距离，避免展开时被导航栏遮挡
      const navEl = document.querySelector('.navbar');
      const navBottom = navEl ? navEl.getBoundingClientRect().bottom : 0;
      const topSafe = navBottom + 12;

      // 清除容器 transform，让卡片 position:fixed 相对视口
      player.style.setProperty('transform', 'none', 'important');
      player.style.setProperty('bottom', 'auto', 'important');
      player.style.setProperty('left', rect.left + 'px', 'important');
      player.style.setProperty('top', rect.top + 'px', 'important');

      // 1. 先移除所有可能残留的内联 transform/transition，重置 max-height 以获取真实尺寸
      expanded.style.removeProperty('transform');
      expanded.style.removeProperty('transform-origin');
      expanded.style.transition = 'none';
      expanded.style.removeProperty('--origin-x');
      expanded.style.removeProperty('--origin-y');
      expanded.style.setProperty('--player-max-h', 'none');
      expanded.style.removeProperty('touch-action');

      // 先获取卡片尺寸（此时还是可见状态）
      const cardW = expanded.offsetWidth || 246;
      const cardH = expanded.offsetHeight || 400;

      // 计算小图标中心位置
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const edgeMargin = 8;
      let targetLeft, targetTop;

      // 检查是否有保存的拖拽位置（仅展开时使用，保持上次拖拽位置）
      let savedPos = null;
      try {
        const raw = localStorage.getItem('musicExpandedPos');
        if (raw) savedPos = JSON.parse(raw);
      } catch (_) {}

      if (savedPos && typeof savedPos.x === 'number' && typeof savedPos.y === 'number') {
        targetLeft = savedPos.x;
        targetTop = savedPos.y;
      } else {
        // 默认：卡片以小图标为中心，向四周展开
        targetLeft = btnCenterX - cardW / 2;
        targetTop = btnCenterY - cardH / 2;
      }

      // 横向边界约束
      const maxLeft = Math.max(edgeMargin, vw - cardW - edgeMargin);
      if (targetLeft < edgeMargin) targetLeft = edgeMargin;
      if (targetLeft > maxLeft) targetLeft = maxLeft;

      // 纵向边界约束
      const maxTop = Math.max(topSafe, vh - cardH - edgeMargin);
      if (targetTop < topSafe) targetTop = topSafe;
      if (targetTop > maxTop) targetTop = maxTop;

      // 如果卡片超出视口，限制最大高度以允许滚动
      let maxH = cardH;
      if (targetTop + cardH > vh - edgeMargin) {
        maxH = Math.min(cardH, vh - targetTop - edgeMargin);
      }

      // 设置卡片目标位置
      expanded.style.left = targetLeft + 'px';
      expanded.style.top = targetTop + 'px';
      expanded.style.setProperty('--player-max-h', maxH + 'px');

      // 计算 transform-origin：始终指向小图标中心
      // 这样展开动画一定从小图标位置向四周扩散
      const originX = btnCenterX - targetLeft;
      const originY = btnCenterY - targetTop;

      // 直接用内联样式设置 transform-origin，确保立即生效
      expanded.style.transformOrigin = originX + 'px ' + originY + 'px';

      requestAnimationFrame(() => {
        // 清除 transition:none，恢复 CSS 过渡
        expanded.style.transition = '';

        // 此时 .collapsed 状态下：CSS transform:scale(0.08) 生效
        // 移除 .collapsed → 过渡到 scale(1)，实现从小图标位置向四周扩散
        player.classList.remove('collapsed');
        resetCollapseTimer();
      });

      // resize 监听
      if (!window.__musicResizeHandler) {
        window.__musicResizeHandler = function () {
          const exp = player.querySelector('.music-player-expanded');
          if (!exp || player.classList.contains('collapsed')) return;

          const r = collapsed.getBoundingClientRect();
          const cw = window.innerWidth;
          const ch = window.innerHeight;
          const edgeMargin = 8;

          // 导航栏底部安全距离
          const navEl = document.querySelector('.navbar');
          const navBottom = navEl ? navEl.getBoundingClientRect().bottom : 0;
          const topSafe = navBottom + 12;

          // 先重置 max-height 以获取真实内容高度
          exp.style.setProperty('--player-max-h', 'none');
          const cW = exp.offsetWidth || 246;
          const cH = exp.offsetHeight || 400;

          // 检查是否有拖拽保存的位置
          let savedPos = null;
          try {
            const raw = localStorage.getItem('musicExpandedPos');
            if (raw) savedPos = JSON.parse(raw);
          } catch (_) {}

          let newLeft, newTop;
          if (savedPos && typeof savedPos.x === 'number' && typeof savedPos.y === 'number') {
            // 有保存位置 → 保持位置，做视口边界约束
            const maxX = Math.max(edgeMargin, cw - cW - edgeMargin);
            const maxY = Math.max(topSafe, ch - cH - edgeMargin);
            newLeft = Math.max(edgeMargin, Math.min(savedPos.x, maxX));
            newTop = Math.max(topSafe, Math.min(savedPos.y, maxY));
          } else {
            // 无保存位置 → 以小图标为中心
            const btnCX = r.left + r.width / 2;
            const btnCY = r.top + r.height / 2;
            newLeft = btnCX - cW / 2;
            newTop = btnCY - cH / 2;

            // 横向边界约束
            const maxLeft = Math.max(edgeMargin, cw - cW - edgeMargin);
            if (newLeft < edgeMargin) newLeft = edgeMargin;
            if (newLeft > maxLeft) newLeft = maxLeft;

            // 纵向边界约束
            const maxTop = Math.max(topSafe, ch - cH - edgeMargin);
            if (newTop < topSafe) newTop = topSafe;
            if (newTop > maxTop) newTop = maxTop;
          }

          let newMaxH = cH;
          if (newTop + cH > ch - edgeMargin) {
            newTop = Math.max(topSafe, ch - cH - edgeMargin);
            newMaxH = Math.min(cH, ch - newTop - edgeMargin);
          }

          exp.style.left = newLeft + 'px';
          exp.style.top = newTop + 'px';
          exp.style.setProperty('--player-max-h', newMaxH + 'px');

          // 更新 transform-origin
          const btnCX = r.left + r.width / 2;
          const btnCY = r.top + r.height / 2;
          exp.style.setProperty('--origin-x', (btnCX - newLeft) + 'px');
          exp.style.setProperty('--origin-y', (btnCY - newTop) + 'px');
        };
        window.addEventListener('resize', window.__musicResizeHandler);
      }
    }

    // 重置自动收缩计时器
    const COLLAPSE_DELAY = 5000;
    let countdownWarnTimer = null;
    let countdownEndTimer = null;

    function startCountdownAnimation() {
      if (!countdownEl || player.classList.contains('collapsed')) return;
      countdownEl.classList.remove('is-warning');
      // 强制重启动画：先移除 is-counting，再下一帧添加
      countdownEl.classList.remove('is-counting');
      // 重置 transform 以便重启动画
      void countdownEl.offsetWidth;
      countdownEl.classList.add('is-counting');
      // 3 秒后进入警告态（剩余 2 秒）
      clearTimeout(countdownWarnTimer);
      countdownWarnTimer = setTimeout(() => {
        if (!player.classList.contains('collapsed') && countdownEl) {
          countdownEl.classList.add('is-warning');
        }
      }, 3000);
    }

    function stopCountdownAnimation() {
      if (!countdownEl) return;
      countdownEl.classList.remove('is-counting', 'is-warning');
      clearTimeout(countdownWarnTimer);
    }

    function resetCollapseTimer() {
      clearTimeout(collapseTimer);
      clearTimeout(countdownEndTimer);
      startCountdownAnimation();
      countdownEndTimer = setTimeout(() => collapse(true), COLLAPSE_DELAY);
      // 同步 collapseTimer 变量供其他地方引用
      collapseTimer = countdownEndTimer;
    }

    // 先同步循环按钮 UI（从 localStorage 读取的偏好），再加载第一首歌
    syncLoopUi();
    loadSong(currentIndex);
    play();

    // 渲染音乐目录
    renderPlaylist();

    // 初始化：确保容器位置与小圆球同步，并为卡片预设初始位置
    (function initContainerPos() {
      const rect = collapsed.getBoundingClientRect();
      player.style.setProperty('transform', 'none', 'important');
      player.style.setProperty('bottom', 'auto', 'important');
      player.style.setProperty('left', rect.left + 'px', 'important');
      player.style.setProperty('top', rect.top + 'px', 'important');
      collapsed.style.setProperty('transform', 'none', 'important');
      collapsed.style.setProperty('bottom', 'auto', 'important');
      collapsed.style.setProperty('left', rect.left + 'px', 'important');
      collapsed.style.setProperty('top', rect.top + 'px', 'important');

      // 为展开卡片设置初始位置（在小圆球处，配合 .collapsed 缩放隐藏）
      const expanded = player.querySelector('.music-player-expanded');
      if (expanded) {
        expanded.style.left = rect.left + 'px';
        expanded.style.top = rect.top + 'px';
        expanded.style.setProperty('--player-max-h', 'none');
        // transform-origin 指向小圆球中心
        const btnCx = rect.left + rect.width / 2;
        const btnCy = rect.top + rect.height / 2;
        expanded.style.setProperty('--origin-x', (btnCx - rect.left) + 'px');
        expanded.style.setProperty('--origin-y', (btnCy - rect.top) + 'px');
      }
    })();

    // 初始定时器：若播放器初始为展开态则启动倒计时，否则不启动
    if (!player.classList.contains('collapsed')) {
      resetCollapseTimer();
    }

    // ================================================================
    // 收起小圆球拖拽：自由移动 + localStorage 持久化，解决挡住卡片/封面/按钮
    //   - pointer 移动 < 8px：视为普通 click → 交给原有 click 展开播放器
    //   - pointer 移动 ≥ 8px：视为拖拽 → 结束后吞噬 click、保存新位置
    //   - 拖拽中 wasDraggedNow 立即设为 true，防止 pointerup 不在元素上时 click 穿透
    // ================================================================
    const POS_KEY = 'musicCollapsedPos';
    const DRAG_MIN_PX = 8;
    let dragState = null;
    let wasDraggedNow = false;
    let pendingClickBlock = false;

    function applyCollapsedPos(x, y) {
      const prio = 'important';
      player.style.setProperty('bottom',    'auto',   prio);
      player.style.setProperty('left',      x + 'px', prio);
      player.style.setProperty('top',       y + 'px', prio);
      player.style.setProperty('transform', 'none',   prio);
      collapsed.style.setProperty('bottom',    'auto',   prio);
      collapsed.style.setProperty('left',      x + 'px', prio);
      collapsed.style.setProperty('top',       y + 'px', prio);
      collapsed.style.setProperty('transform', 'none',   prio);
    }
    function clampPos(x, y) {
      const size = collapsed.getBoundingClientRect().width || 56;
      const maxX = Math.max(0, window.innerWidth  - size);
      const maxY = Math.max(0, window.innerHeight - size);
      return [Math.max(0, Math.min(x, maxX)), Math.max(0, Math.min(y, maxY))];
    }
    // 页面加载：恢复已保存的自定义位置
    (function restoreSavedPos() {
      let saved = null;
      try { saved = JSON.parse(localStorage.getItem(POS_KEY) || 'null'); } catch (_) {}
      if (!saved || typeof saved.x !== 'number' || typeof saved.y !== 'number') return;
      const [x, y] = clampPos(saved.x, saved.y);
      applyCollapsedPos(x, y);
      if (x !== saved.x || y !== saved.y) {
        try { localStorage.setItem(POS_KEY, JSON.stringify({ x, y })); } catch (_) {}
      }
    })();

    // 位置就绪：解除收起按钮的 FOUC 隐藏（放在 restoreSavedPos 之后，确保无跳变）
    player.classList.add('pos-ready');

    collapsed.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      const rect = collapsed.getBoundingClientRect();
      dragState = {
        pointerId: e.pointerId,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        startClientX: e.clientX,
        startClientY: e.clientY,
        moved: false
      };
      wasDraggedNow = false;
      pendingClickBlock = false;
      try { collapsed.setPointerCapture(e.pointerId); } catch (_) {}
    });

    collapsed.addEventListener('pointermove', (e) => {
      if (!dragState || e.pointerId !== dragState.pointerId) return;
      const dx = e.clientX - dragState.startClientX;
      const dy = e.clientY - dragState.startClientY;
      if (!dragState.moved && (Math.abs(dx) >= DRAG_MIN_PX || Math.abs(dy) >= DRAG_MIN_PX)) {
        dragState.moved = true;
        wasDraggedNow = true;
        pendingClickBlock = true;
      }
      if (!dragState.moved) return;
      let nx = e.clientX - dragState.offsetX;
      let ny = e.clientY - dragState.offsetY;
      [nx, ny] = clampPos(nx, ny);
      applyCollapsedPos(nx, ny);
      e.preventDefault();
      e.stopPropagation();
    });

    function endDragHandler(e) {
      if (!dragState || e.pointerId !== dragState.pointerId) return;
      try { collapsed.releasePointerCapture(e.pointerId); } catch (_) {}
      if (dragState.moved) {
        wasDraggedNow = true;
        pendingClickBlock = true;
        const rect = collapsed.getBoundingClientRect();
        const pos = { x: Math.round(rect.left), y: Math.round(rect.top) };
        try { localStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch (_) {}
        e.preventDefault();
        e.stopPropagation();
      }
      dragState = null;
    }
    collapsed.addEventListener('pointerup',     endDragHandler);
    collapsed.addEventListener('pointercancel', endDragHandler);

    // 全局监听 pointerup，防止拖拽中元素移动到指针下方导致的事件丢失
    document.addEventListener('pointerup', (e) => {
      if (!dragState) return;
      endDragHandler(e);
    });
    document.addEventListener('pointercancel', (e) => {
      if (!dragState) return;
      endDragHandler(e);
    });

    window.addEventListener('resize', () => {
      let saved = null;
      try { saved = JSON.parse(localStorage.getItem(POS_KEY) || 'null'); } catch (_) {}
      if (!saved) return;
      const [x, y] = clampPos(saved.x, saved.y);
      applyCollapsedPos(x, y);
      if (x !== saved.x || y !== saved.y) {
        try { localStorage.setItem(POS_KEY, JSON.stringify({ x, y })); } catch (_) {}
      }
    });

    // 点击收起态小圆形 → 直接展开播放器
    collapsed.addEventListener('click', (e) => {
      // 拖拽过 → 阻止展开
      if (wasDraggedNow || pendingClickBlock) {
        wasDraggedNow = false;
        pendingClickBlock = false;
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      expand();
      if (!hasInteracted) {
        hasInteracted = true;
        if (!isPlaying) play();
      }
    });

    // ================================================================
    // 展开态播放器拖拽：整个卡片可拖动，交互元素除外
    //   - 拖拽阈值 5px，防止手抖误拖
    //   - 拖拽中阻止点击事件穿透
    //   - 位置持久化到 localStorage，重新展开时恢复
    //   - 拖拽时清除 max-height 限制，让内容完整显示
    // ================================================================
    const expanded = player.querySelector('.music-player-expanded');
    const EXP_POS_KEY = 'musicExpandedPos';
    const EXP_DRAG_MIN = 5;
    let expDragState = null;
    let expWasDragged = false;

    // 交互元素选择器：点击这些元素不启动拖拽
    const expInteractiveSel = [
      '.music-btn',
      '.music-progress',
      '.music-progress-bar',
      '.music-playlist-item',
      '.music-collapse-btn',
      '.music-time-row',
      '.music-playlist',
      '.music-control-panel',
      'button',
      'input',
      'select',
      'textarea',
      '[role="button"]'
    ].join(', ');

    if (expanded) {
      expanded.addEventListener('pointerdown', (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        // 在交互元素上 → 不启动拖拽
        if (e.target.closest(expInteractiveSel)) return;

        const rect = expanded.getBoundingClientRect();
        expDragState = {
          pointerId: e.pointerId,
          offsetX: e.clientX - rect.left,
          offsetY: e.clientY - rect.top,
          startClientX: e.clientX,
          startClientY: e.clientY,
          moved: false,
          width: rect.width,
          height: rect.height
        };
        expWasDragged = false;
        try { expanded.setPointerCapture(e.pointerId); } catch (_) {}
        // 拖拽开始时禁用触摸滚动
        expanded.style.touchAction = 'none';
      });

      expanded.addEventListener('pointermove', (e) => {
        if (!expDragState || e.pointerId !== expDragState.pointerId) return;
        const dx = e.clientX - expDragState.startClientX;
        const dy = e.clientY - expDragState.startClientY;
        if (!expDragState.moved && (Math.abs(dx) >= EXP_DRAG_MIN || Math.abs(dy) >= EXP_DRAG_MIN)) {
          expDragState.moved = true;
          expWasDragged = true;
          expanded.classList.add('is-dragging');
        }
        if (!expDragState.moved) return;
        let nx = e.clientX - expDragState.offsetX;
        let ny = e.clientY - expDragState.offsetY;
        // 边界约束
        const w = expDragState.width;
        const h = expDragState.height;
        const maxX = Math.max(0, window.innerWidth - w);
        const maxY = Math.max(0, window.innerHeight - h);
        nx = Math.max(0, Math.min(nx, maxX));
        ny = Math.max(0, Math.min(ny, maxY));
        expanded.style.left = nx + 'px';
        expanded.style.top = ny + 'px';
        // 清除 max-height 限制，让内容完整显示
        expanded.style.removeProperty('--player-max-h');
        // 更新 transform-origin（跟随折叠按钮中心，保持收起动画自然）
        const r = collapsed.getBoundingClientRect();
        expanded.style.setProperty('--origin-x', (r.left + r.width / 2 - nx) + 'px');
        expanded.style.setProperty('--origin-y', (r.top + r.height / 2 - ny) + 'px');
        e.preventDefault();
        e.stopPropagation();
      });

      function endExpDrag(e) {
        if (!expDragState || e.pointerId !== expDragState.pointerId) return;
        try { expanded.releasePointerCapture(e.pointerId); } catch (_) {}
        // 恢复触摸滚动和光标
        expanded.style.touchAction = '';
        expanded.classList.remove('is-dragging');
        if (expDragState.moved) {
          expWasDragged = true;
          const rect = expanded.getBoundingClientRect();
          const pos = { x: Math.round(rect.left), y: Math.round(rect.top) };
          try { localStorage.setItem(EXP_POS_KEY, JSON.stringify(pos)); } catch (_) {}
          e.preventDefault();
          e.stopPropagation();
        }
        expDragState = null;
      }
      expanded.addEventListener('pointerup', endExpDrag);
      expanded.addEventListener('pointercancel', endExpDrag);

      // 全局监听 pointerup/cancel，防止拖拽中元素移动导致事件丢失
      document.addEventListener('pointerup', (e) => {
        if (!expDragState) return;
        endExpDrag(e);
      });
      document.addEventListener('pointer.cancel', (e) => {
        if (!expDragState) return;
        endExpDrag(e);
      });

      // 拖拽时阻止 click 事件穿透（捕获阶段拦截）
      expanded.addEventListener('click', (e) => {
        if (expWasDragged) {
          expWasDragged = false;
          e.stopPropagation();
          e.preventDefault();
        }
      }, true);

      // 鼠标悬停时暂停自动收起，离开时恢复计时
      expanded.addEventListener('mouseenter', () => {
        clearTimeout(collapseTimer);
        clearTimeout(countdownEndTimer);
        clearTimeout(countdownWarnTimer);
        if (countdownEl) countdownEl.classList.add('is-paused');
      });
      expanded.addEventListener('mouseleave', () => {
        if (!player.classList.contains('collapsed')) {
          if (countdownEl) countdownEl.classList.remove('is-paused');
          resetCollapseTimer();
        }
      });
    }

    // 手动收起播放器（音乐继续播放）
    collapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearTimeout(collapseTimer);
      stopCountdownAnimation();
      collapse();
    });

    // 播放/暂停
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
      resetCollapseTimer();
    });

    // 上一首 / 下一首
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prev();
      resetCollapseTimer();
    });
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      next();
      resetCollapseTimer();
    });

    // 音乐目录开关
    listBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = player.classList.toggle('show-playlist');
      listBtn.classList.toggle('active-toggle', isOpen);
      resetCollapseTimer();

      if (!player.classList.contains('collapsed')) {
        const exp = player.querySelector('.music-player-expanded');
        if (exp) {
          // 先移除高度限制，让播放列表可以完整展开
          exp.style.removeProperty('--player-max-h');

          // 等 CSS 过渡完成（max-height 0.4s）后再重新测量
          setTimeout(() => {
            const cH = exp.scrollHeight;
            const cW = exp.offsetWidth || 246;
            const vh = window.innerHeight;
            const edgeMargin = 8;

            const currentTop = parseFloat(exp.style.top) || 0;
            const maxTop = Math.max(0, vh - cH - edgeMargin);
            const maxLeft = Math.max(edgeMargin, window.innerWidth - cW - edgeMargin);

            let targetLeft = parseFloat(exp.style.left) || edgeMargin;
            let targetTop = Math.max(0, Math.min(currentTop, maxTop));
            targetLeft = Math.max(edgeMargin, Math.min(targetLeft, maxLeft));

            let maxH = cH;
            if (targetTop + cH > vh - edgeMargin) {
                maxH = Math.min(cH, vh - targetTop - edgeMargin);
            }

            exp.style.left = targetLeft + 'px';
            exp.style.top = targetTop + 'px';
            exp.style.setProperty('--player-max-h', maxH + 'px');
          }, 420);
        }
      }
    });

    // 点击歌曲播放（事件委托）
    playlistList.addEventListener('click', async (e) => {
      e.stopPropagation();
      const item = e.target.closest('[data-idx]');
      if (!item) return;
      const idx = parseInt(item.dataset.idx, 10);
      if (idx === currentIndex) { togglePlay(); }
      else { currentIndex = idx; await loadSong(currentIndex); play(); }
      renderPlaylist();
      resetCollapseTimer();
    });

    /* ================================================================
     * 进度条：拖拽状态机 + 实时预览
     * - isDragging = 用户正在用指针拖动：只改 UI，不改 audio.currentTime
     *   （避免 timeupdate 高频事件与拖拽竞争，造成"回弹/拉扯"）
     * - dragMoved = 是否真正移动过（<4px 算 click，否则算 drag）
     * - setPointerCapture：拖出进度条外仍能收到 move/up 事件
     * ================================================================ */
    let isDragging = false;
    let dragMoved = false;
    let dragDownX = 0;
    let dragDownY = 0;
    let dragPercent = 0;   // 最近一次预览百分比（0~1）
    // seek 过渡期：设置 currentTime 后浏览器会触发若干次 timeupdate 仍是旧位置，
    // 加 180ms 忽略窗口，避免松手后又跳回旧位置（回弹）
    let seekIgnoreUntil = 0;
    const DRAG_THRESHOLD = 4; // 像素：超过此距离才算"拖拽"，否则算普通点击
    let usingTouch = false;  // 移动端：同一轮拖拽优先走 touch 事件，pointer 事件跳过

    // 计算指针在进度条中的百分比（0~1，含边界保护）
    function getProgressPercent(clientX) {
      if (!progressEl) return 0;
      const rect = progressEl.getBoundingClientRect();
      // 注意：进度条有 padding:8px 0 扩大上下热区，但左右没有 padding，所以直接用 rect.width
      const raw = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
      return Math.min(1, Math.max(0, raw));
    }
    // 用百分比直接写 UI 预览（不写 audio.currentTime）
    function renderDragPreview(percent) {
      const dur = audio.duration;
      progressBar.style.transition = 'none';
      progressBar.style.width = (percent * 100) + '%';
      if (dur && isFinite(dur) && curTimeEl) {
        curTimeEl.textContent = formatTime(percent * dur);
      }
      requestAnimationFrame(() => {
        // 下一帧恢复 transition（预览结束后恢复平滑）
        if (!isDragging) progressBar.style.transition = '';
      });
    }

    // 播放中持续同步：拖拽中或 seek 过渡期跳过进度更新，避免 UI 竞争回弹
    audio.addEventListener('timeupdate', () => {
      if (isDragging) return;
      if (seekIgnoreUntil && Date.now() < seekIgnoreUntil) return;
      updateMusicProgress();
    });
    // 元数据加载完（duration 可得）立刻刷新一次时间显示，避免 0:00 → 实际时长的突兀
    audio.addEventListener('loadedmetadata', () => {
      updateMusicProgress();
    });
    audio.addEventListener('durationchange', () => {
      updateMusicProgress();
    });

    // 播放完毕：不再依赖 audio.loop 原生循环，所有模式统一处理
    audio.addEventListener('ended', () => {
      if (loopMode === 'sequence') {
        next();
        return;
      }
      // 单曲循环模式：按 remainingLoops 递减，耗尽则切到下一首
      if (remainingLoops === Infinity) {
        // 无限循环：直接重播当前歌曲
        audio.currentTime = 0;
        play();
      } else if (remainingLoops > 1) {
        // 还有「剩余可播放次数」：消耗 1 次后重播当前歌曲
        remainingLoops -= 1;
        audio.currentTime = 0;
        play();
      } else {
        // remainingLoops === 1：当前这遍是最后一遍，结束后切歌
        next();
      }
    });

    // -------- 进度条拖动（统一 Pointer Events，兼容桌面/移动端/静态部署） --------
    // 关键：CSS .music-progress 已设 touch-action:none 阻止浏览器默认滚动；
    // setPointerCapture 保证指针移出元素后仍能收到 move/up 事件（移动端必需）。
    // 不再使用 touch 事件兜底——现代移动端浏览器(iOS13+/Android Chrome)均支持 Pointer Events，
    // 两套事件并存反而会因标志位不全导致 pointermove 与 touchmove 同时执行、互相冲突。
    progressEl.addEventListener('pointerdown', (e) => {
      if (!audio.duration || !isFinite(audio.duration)) return;
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
      isDragging = true;
      dragMoved = false;
      dragDownX = e.clientX;
      dragDownY = e.clientY;
      dragPercent = getProgressPercent(e.clientX);
      progressEl.classList.add('is-dragging');
      try { progressEl.setPointerCapture(e.pointerId); } catch (_) { /* 旧浏览器忽略 */ }
      renderDragPreview(dragPercent);
    });

    progressEl.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
      const dx = e.clientX - dragDownX;
      const dy = e.clientY - dragDownY;
      if (!dragMoved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        dragMoved = true;
      }
      dragPercent = getProgressPercent(e.clientX);
      renderDragPreview(dragPercent);
    });

    function endDrag(e, isCancel) {
      if (!isDragging) return;
      const wasPlaying = !audio.paused;
      try { progressEl.releasePointerCapture(e.pointerId); } catch (_) {}
      progressEl.classList.remove('is-dragging');
      isDragging = false;
      // pointercancel（移动端手势干扰常见）：恢复实际进度，不执行 seek
      if (isCancel) { updateMusicProgress(); return; }
      if (audio.duration && isFinite(audio.duration)) {
        const percent = dragMoved ? dragPercent : getProgressPercent(e.clientX);
        const targetTime = Math.min(audio.duration, Math.max(0, percent * audio.duration));
        // seek 后短暂忽略 timeupdate，防止旧进度回弹
        seekIgnoreUntil = Date.now() + 200;
        audio.currentTime = targetTime;
        updateMusicProgress(true);
        // 移动端：seek 后若原本在播放，显式 play() 确保不因 seek 暂停
        if (wasPlaying) {
          const p = audio.play();
          if (p && p.catch) p.catch(() => { /* 忽略自动播放限制 */ });
        }
      }
      resetCollapseTimer();
    }
    progressEl.addEventListener('pointerup',    (e) => endDrag(e, false));
    progressEl.addEventListener('pointercancel',(e) => endDrag(e, true));

    // 循环切换按钮：顺序播放 ↔ 单曲循环(1次) ↔ 单曲循环(3次) ↔ 单曲循环(5次) ↔ 单曲循环(∞)
    loopBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      let msg;
      if (loopMode === 'sequence') {
        // 第一次进入单曲循环：从 1 次开始
        loopMode = 'single';
        loopCount = 1;
        remainingLoops = loopCount;
        msg = '已切换：单曲循环（1 次）';
      } else {
        // 已是单曲循环：在 [1,3,5,∞] 里前进一个档位，到 ∞ 的下一档回到顺序播放
        const idx = LOOP_COUNT_ORDER.indexOf(loopCount);
        const nextIdx = idx + 1;
        if (nextIdx >= LOOP_COUNT_ORDER.length) {
          // 回到顺序播放
          loopMode = 'sequence';
          audio.loop = false;
          msg = '已切换：顺序播放';
        } else {
          loopCount = LOOP_COUNT_ORDER[nextIdx];
          remainingLoops = loopCount;
          const countLabel = (loopCount === Infinity) ? '无限' : loopCount + ' 次';
          msg = '已切换：单曲循环（' + countLabel + '）';
        }
      }
      try {
        localStorage.setItem('musicLoopMode', loopMode);
        if (loopMode === 'single') {
          localStorage.setItem('musicLoopCount', String(loopCount));
        } else {
          localStorage.removeItem('musicLoopCount');
        }
      } catch (_) { /* 隐私模式下可能失败，忽略 */ }
      syncLoopUi();
      showToast(msg, false);
      resetCollapseTimer();
    });

    // 首次用户交互时启动播放（解决浏览器自动播放限制）
    function firstInteraction() {
      if (!hasInteracted) {
        hasInteracted = true;
        if (!isPlaying) play();
        showToast('音乐已开启', false);
      }
      document.removeEventListener('click', firstInteraction);
      document.removeEventListener('touchstart', firstInteraction);
    }
    document.addEventListener('click', firstInteraction);
    document.addEventListener('touchstart', firstInteraction);

    // 提示用户点击任意处即可播放音乐
    setTimeout(() => {
      if (!hasInteracted) showToast('点击任意位置开始播放音乐', false);
    }, 1200);
  }

  /* ---------- 启动 ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    // 深色模式切换逻辑
    const themeToggle = $('#themeToggle');
    const html = document.documentElement;
    
    // 初始化：检查 localStorage 或时间判断/系统偏好
    // 优先级：用户手动选择 > 时间判断（夜间19-7点/日间） > 系统偏好
    function initDarkMode() {
      const saved = localStorage.getItem('theme');
      const h = new Date().getHours();
      const isNight = h >= 19 || h < 7;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldBeDark = saved === 'dark' || (!saved && (isNight || prefersDark));
      
      if (shouldBeDark) {
        html.setAttribute('data-theme', 'dark');
        themeToggle?.classList.add('dark');
        updateThemeIcon(true);
      }
    }
    
    // 更新图标（图标由 CSS 控制显示，无需 JS 切换）
    function updateThemeIcon(isDark) {
      if (isDark) {
        themeToggle?.setAttribute('aria-label', '切换日间模式');
        themeToggle?.setAttribute('title', '切换日间模式');
      } else {
        themeToggle?.setAttribute('aria-label', '切换夜间模式');
        themeToggle?.setAttribute('title', '切换夜间模式');
      }
    }
    
    // 切换主题
    function toggleDarkMode() {
      const isDark = html.getAttribute('data-theme') === 'dark';
      const newIsDark = !isDark;
      
      if (newIsDark) {
        html.setAttribute('data-theme', 'dark');
        themeToggle?.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        html.removeAttribute('data-theme');
        themeToggle?.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      
      updateThemeIcon(newIsDark);
      showToast(newIsDark ? '已切换到夜间模式' : '已切换到日间模式');
    }
    
    // 绑定点击事件
    themeToggle?.addEventListener('click', toggleDarkMode);
    
    // 初始化主题
    initDarkMode();

    // 年份
    $('#yearNow').textContent = new Date().getFullYear();

    // 涟漪效果：为所有支持点击反馈的元素添加点击波纹动画
    function addRippleEffect(selector) {
      document.addEventListener('click', function(e) {
        const target = e.target.closest(selector);
        if (!target) return;
        
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${e.clientX - rect.left - size / 2}px;
          top: ${e.clientY - rect.top - size / 2}px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: scale(0);
          animation: rippleEffect 0.6s ease-out;
          pointer-events: none;
        `;
        
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    }
    
    // 为页脚按钮、社交动作按钮等添加涟漪效果
    addRippleEffect('.footer-icon-btn, .social-action');

    // 我的年龄 / 出生日期 / 星座（数据源：site-config.js，全站同步）
    const sb = window.SITE_BIRTH;
    if (sb) {
      const ageEl = $('#myAge');
      if (ageEl) ageEl.textContent = sb.getAge();
      const bdEl = $('#birthDate');
      if (bdEl) bdEl.textContent = sb.formatBirthDate();
      const zdEl = $('#birthZodiac');
      if (zdEl) {
        const z = sb.getZodiacInfo();
        zdEl.textContent = z.name + ' ' + z.icon;
      }
    }

    // 本站已运行计时器
    // 建站起始时间：2026-08-24 00:00:00，如需修改改这一行即可
    const siteBirth = new Date('2026-08-24T00:00:00');
    const runtimeDaysEl  = $('#runtimeDays');
    const runtimeHoursEl = $('#runtimeHours');
    const runtimeMinsEl  = $('#runtimeMins');
    const runtimeSecsEl  = $('#runtimeSecs');
    function updateRuntime() {
      const diff = Date.now() - siteBirth.getTime();
      if (diff < 0) {
        if (runtimeDaysEl)  runtimeDaysEl.textContent  = '0';
        if (runtimeHoursEl) runtimeHoursEl.textContent = '00';
        if (runtimeMinsEl)  runtimeMinsEl.textContent  = '00';
        if (runtimeSecsEl)  runtimeSecsEl.textContent  = '00';
        return;
      }
      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000) / 60000);
      const secs  = Math.floor((diff % 60000) / 1000);
      if (runtimeDaysEl)  runtimeDaysEl.textContent  = String(days);
      if (runtimeHoursEl) runtimeHoursEl.textContent = String(hours).padStart(2, '0');
      if (runtimeMinsEl)  runtimeMinsEl.textContent  = String(mins).padStart(2,  '0');
      if (runtimeSecsEl)  runtimeSecsEl.textContent  = String(secs).padStart(2,  '0');
    }
    updateRuntime();
    setInterval(updateRuntime, 1000);

    // 运行时间四个卡片：点击动态效果（涟漪 + 弹性弹跳回弹 + 每个卡片数字专属抖动）
    function bindRuntimeCardClick() {
      const cards = $$('.runtime-card');
      if (!cards.length) return;

      // DOM 顺序 → 数字抖动风格映射
      // [0] 天 → countUp  数字跳动计数器
      // [1] 时 → shakeLR  左右轻晃时钟摆
      // [2] 分 → spinPop  小旋转（齿轮感）
      // [3] 秒 → pulseBeat 脉冲心跳（秒针节奏）
      const variants = ['count', 'shake', 'spin', 'pulse'];
      // 每个 variant 的数字动画时长（毫秒），popTimer 在此基础上 +60ms 缓冲
      const variantDuration = { count: 680, shake: 680, spin: 640, pulse: 720 };

      const cardTimers = new WeakMap();
      cards.forEach((card, idx) => {
        cardTimers.set(card, []);
        const variant = variants[idx % variants.length];
        card.classList.add('num-variant-' + variant);
        card.dataset.numVariant = variant;
      });

      const clearCardTimers = (card) => {
        const timers = cardTimers.get(card);
        if (!timers) return;
        timers.forEach(id => clearTimeout(id));
        timers.length = 0;
      };

      cards.forEach(card => {
        const variant = card.dataset.numVariant;
        const popDuration = (variantDuration[variant] ?? 720) + 60;

        // pointerdown：创建涟漪
        card.addEventListener('pointerdown', (e) => {
          if (e.target.closest('a, button, [role="button"], input, textarea, select')) return;

          const rect = card.getBoundingClientRect();
          const x = (typeof e.clientX === 'number' ? e.clientX : (rect.left + rect.width / 2)) - rect.left;
          const y = (typeof e.clientY === 'number' ? e.clientY : (rect.top + rect.height / 2)) - rect.top;
          const size = Math.max(rect.width, rect.height) * 0.9;

          const ripple = document.createElement('span');
          ripple.className = 'card-ripple';
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = (x - size / 2) + 'px';
          ripple.style.top  = (y - size / 2) + 'px';
          card.appendChild(ripple);

          const timers = cardTimers.get(card);
          const rmTimer = setTimeout(() => {
            if (ripple.parentNode === card) ripple.remove();
            const i = timers.indexOf(rmTimer);
            if (i >= 0) timers.splice(i, 1);
          }, 700);
          timers.push(rmTimer);
        });

        // pointerup / click：弹性弹跳回弹 + 数字抖动
        const runTapPop = (e) => {
          if (e && e.target && e.target.closest('a, button, [role="button"], input, textarea, select')) return;
          clearCardTimers(card);
          card.classList.remove('card-tap-pop');
          void card.offsetWidth;
          card.classList.add('card-tap-pop');

          const timers = cardTimers.get(card);
          const popTimer = setTimeout(() => {
            card.classList.remove('card-tap-pop');
            const i = timers.indexOf(popTimer);
            if (i >= 0) timers.splice(i, 1);
          }, popDuration);
          timers.push(popTimer);
        };

        card.addEventListener('pointerup', (e) => {
          card.__tapLockUntil = Date.now() + 120;
          runTapPop(e);
        });
        card.addEventListener('click', (e) => {
          if (card.__tapLockUntil && Date.now() < card.__tapLockUntil) return;
          runTapPop(e);
        });
        card.addEventListener('pointercancel', () => clearCardTimers(card));
      });
    }
    bindRuntimeCardClick();

    // 樱花飘落特效
    initSakura();

    // 顺序展示网易云热评（从上往下）+ 切换功能
    let lastCommentIndex = -1;
    
    function showRandomComment() {
      const el = $('#heroHotComment');
      const textEl = el ? el.querySelector('.hot-comment-text') : null;
      const songEl = el ? el.querySelector('.hot-comment-song') : null;
      if (!el || !textEl || !HOT_COMMENTS.length) return;
      
      // 从上往下顺序选择：取下一条，到末尾后回到第一条
      let newIndex;
      if (HOT_COMMENTS.length <= 1) {
        newIndex = 0;
      } else {
        newIndex = (lastCommentIndex + 1) % HOT_COMMENTS.length;
      }
      lastCommentIndex = newIndex;
      
      const item = HOT_COMMENTS[newIndex];
      // 将句号替换为英文句号
      let commentText = item.c.replace(/。/g, '.');
      
      // 添加淡出动画
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      
      setTimeout(() => {
        textEl.textContent = commentText;
        if (item.a) {
          songEl.textContent = `— ${item.a}`;
          songEl.style.display = '';
        } else {
          songEl.style.display = 'none';
        }
        el.style.display = '';
        
        // 添加淡入动画
        el.style.opacity = '';
        el.style.transform = '';
      }, 200);
    }
    
    showRandomComment();
    
    // 绑定切换按钮事件
    const refreshBtn = $('#hotCommentRefresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function() {
        refreshBtn.classList.add('refreshing');
        showRandomComment();
        setTimeout(() => {
          refreshBtn.classList.remove('refreshing');
        }, 400);
      });
    }
    
    // 绑定复制按钮事件
    const copyBtn = $('#hotCommentCopy');
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        const el = $('#heroHotComment');
        const textEl = el ? el.querySelector('.hot-comment-text') : null;
        const songEl = el ? el.querySelector('.hot-comment-song') : null;
        if (!textEl) return;
        
        // 组装完整文本（热评 + 歌曲名）
        let copyText = textEl.textContent;
        if (songEl && songEl.textContent) {
          copyText += ' ' + songEl.textContent;
        }
        
        // 使用 Clipboard API 复制
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(copyText).then(() => {
            showCopySuccess();
          }).catch(() => {
            // 降级方案
            fallbackCopy(copyText);
          });
        } else {
          fallbackCopy(copyText);
        }
      });
    }
    
    // 降级复制方案
    function fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showCopySuccess();
      } catch (e) {
        alert('复制失败，请手动复制');
      }
      document.body.removeChild(textarea);
    }
    
    // 显示复制成功反馈
    function showCopySuccess() {
      const copyBtn = $('#hotCommentCopy');
      if (!copyBtn) return;
      
      const origIcon = copyBtn.innerHTML;
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      
      // 显示 toast 提示
      showToast('热评已复制到剪贴板');
      
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = origIcon;
      }, 1500);
    }

    // 音乐播放器
    initMusicPlayer();

    // 渲染博客 + 资源
    blogVisibleCount = BLOG_MQ.matches ? BLOG_INITIAL_MOBILE : BLOG_INITIAL_DESKTOP;
    renderBlogVisible();
    renderResources(RESOURCES, $('#resourcesGrid'));

    // 移动端：精确的触摸显示/隐藏「查看大图」按钮
    // （防止桌面 :hover 在触屏上的粘性 hover 导致按钮乱闪/误显示）
    function bindMobileViewBtnTouch() {
      const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
      if (!isTouch) return;

      const grid = $('#blogGrid');
      if (!grid) return;

      let autoHideTimer = null;
      let lastShownCover = null;

      function hideAllCovers() {
        $$('.blog-cover.has-image.show-btn', grid).forEach(c => c.classList.remove('show-btn'));
        lastShownCover = null;
        if (autoHideTimer) { clearTimeout(autoHideTimer); autoHideTimer = null; }
      }

      function showBtnForCover(cover) {
        if (!cover || !cover.classList.contains('has-image')) return;
        // 关掉其他所有 cover 上显示的按钮，保持只有一个显示
        $$('.blog-cover.has-image.show-btn', grid).forEach(c => {
          if (c !== cover) c.classList.remove('show-btn');
        });
        cover.classList.add('show-btn');
        lastShownCover = cover;
        // 3秒无操作自动隐藏，避免停留在封面后一直显示
        if (autoHideTimer) clearTimeout(autoHideTimer);
        autoHideTimer = setTimeout(() => {
          cover.classList.remove('show-btn');
          if (lastShownCover === cover) lastShownCover = null;
          autoHideTimer = null;
        }, 3000);
      }

      // 事件委托：从 grid 层统一处理
      grid.addEventListener('touchstart', e => {
        const cover = e.target.closest('.blog-cover.has-image');
        if (!cover) {
          // 手指落在封面以外 → 全部隐藏
          hideAllCovers();
          return;
        }
        const btn = cover.querySelector('.blog-view-image-btn');
        if (!btn) return;
        // 精确判断触摸点是否落在按钮的边界框内
        const touch = e.touches[0];
        const btnRect = btn.getBoundingClientRect();
        const onBtn = touch.clientX >= btnRect.left - 6 && touch.clientX <= btnRect.right + 6
                   && touch.clientY >= btnRect.top  - 6 && touch.clientY <= btnRect.bottom + 6;
        if (onBtn) {
          // 手指在按钮上 → 保持显示 + 刷新倒计时
          showBtnForCover(cover);
        } else {
          // 手指在封面的非按钮区域 → 也显示按钮（让用户知道功能位置），但开始倒计时
          showBtnForCover(cover);
        }
      }, { passive: true });

      // 手指一离开屏幕 → 短延时检查：如果不是落在按钮上触发点击，就全部隐藏
      grid.addEventListener('touchend', e => {
        setTimeout(() => {
          // 如果 touchend 后紧跟着产生了点击按钮事件，click 会把按钮的点击正常消费掉
          // 这里我们只做一件事：重置/清理已经到时间的按钮显示
          if (!lastShownCover) return;
          const btn = lastShownCover.querySelector('.blog-view-image-btn');
          if (btn && lastShownCover.classList.contains('show-btn')) {
            // 还显示着的话，给它留一个 300ms 的窗口接收点击，然后关
            setTimeout(() => {
              if (lastShownCover && lastShownCover.classList.contains('show-btn')) {
                lastShownCover.classList.remove('show-btn');
              }
            }, 300);
          }
        }, 50);
      });

      // 滚动页面时 → 全部隐藏
      window.addEventListener('scroll', hideAllCovers, { passive: true });
    }
    bindMobileViewBtnTouch();

    // VPN/图片频道点击拦截
    $('#blogGrid')?.addEventListener('click', e => {
      // 点击查看大图按钮 或 全屏触摸层 → 打开大图
      const viewBtn = e.target.closest('.blog-view-image-btn, .blog-view-image-touch');
      if (viewBtn) {
        e.preventDefault();
        e.stopPropagation();
        const card = viewBtn.closest('.blog-card');
        if (card) {
          const title = card.dataset.title || '';
          const img = card.dataset.image || '';
          const modal = $('#imageModal');
          const titleEl = $('#imageModalTitle');
          const contentEl = $('#imageModalContent');
          
          if (titleEl) titleEl.textContent = title;
          if (contentEl && img) {
            contentEl.innerHTML = `<img id="imageModalImg" src="${img}" alt="${title}" style="width:100%;display:block;border-radius:16px;">`;
          }
          if (modal) modal.classList.add('show');
          document.body.style.overflow = 'hidden';
        }
        return;
      }

      const link = e.target.closest('a');
      if (!link) return;
      const card = link.closest('.blog-card');
      if (!card) return;

      // 只有点击阅读全文按钮才触发
      if (!link.classList.contains('blog-readmore')) return;

      // 图片类型文章：打开弹窗
      if (card.dataset.type === 'image') {
        e.preventDefault();
        const title = card.dataset.title;
        const isPoster = card.dataset.poster === 'true';
        const modal = $('#imageModal');
        const titleEl = $('#imageModalTitle');
        const contentEl = $('#imageModalContent');
        
        if (titleEl) titleEl.textContent = title;

        if (isPoster && contentEl) {
          // CSS海报模式
          const today = new Date();
          const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
          contentEl.innerHTML = `
            <div class="poster-container" id="posterContainer">
              <div class="poster-bg"></div>
              <div class="poster-content">
                <div class="poster-date">${dateStr}</div>
                <div class="poster-tag">每日60秒</div>
                <h2 class="poster-title">读懂世界</h2>
                <div class="poster-decor">🌍 📚 ✨</div>
                <p class="poster-desc">每天60秒，带你读懂世界<br>精选每日热点知识</p>
                <div class="poster-footer">
                  <span>庆庆纸博客</span>
                  <span>60s · 知识</span>
                </div>
              </div>
            </div>
          `;
        } else {
          // 图片模式
          const img = card.dataset.image;
          if (contentEl) {
            contentEl.innerHTML = `<img id="imageModalImg" src="${img}" alt="${title}" style="width:100%;display:block;border-radius:16px;">`;
          }
        }

        if (modal) modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        return;
      }

      // 文章类型：打开阅读弹窗
      if (card.dataset.type === 'article') {
        e.preventDefault();
        const title = card.dataset.title;
        const content = decodeURIComponent(card.dataset.content || '');
        const modal = $('#articleModal');
        const titleEl = $('#articleModalTitle');
        const contentEl = $('#articleModalContent');
        
        if (titleEl) titleEl.textContent = title;
        if (contentEl) contentEl.innerHTML = content;
        if (modal) modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        return;
      }

      // VPN频道点击拦截：弹窗确认
      const vpnCard = card.closest('[data-vpn]');
      if (vpnCard) {
        e.preventDefault();
        const vpnUrl = vpnCard.dataset.vpn;
        showVpnModal(vpnUrl);
      }
    });

    // 绑定功能
    bindNavbar();
    bindNavAutoHide();   // 导航链接跳转后5秒自动隐藏导航栏
    bindMobileNav();
    bindModalClose();
    initVpnModal();
    bindSocialCards();
    bindResourceCards();
    bindLoadMore();
    bindAboutCardClick();  // 关于我四个卡片：点击涟漪+弹跳回弹
    bindBirthdayBless();

    // 同步配置到页面（方便用户只改一处）
    $$('.social-qq').forEach(el => {
      el.dataset.qq = SOCIAL_CONFIG.qq.number;
      el.dataset.qqLink = SOCIAL_CONFIG.qq.jumpLink;
      const idBtn = el.querySelector('.copy-id-btn');
      if (idBtn) {
        idBtn.dataset.copyId = SOCIAL_CONFIG.qq.number;
        idBtn.innerHTML = `${SOCIAL_CONFIG.qq.number} <i class="fa-solid fa-copy"></i>`;
      }
    });
    $$('.social-wechat').forEach(el => {
      el.dataset.wechat = SOCIAL_CONFIG.wechat.id;
      el.dataset.wechatName = SOCIAL_CONFIG.wechat.nickname;
      const idBtn = el.querySelector('.copy-id-btn');
      if (idBtn) {
        idBtn.dataset.copyId = SOCIAL_CONFIG.wechat.id;
        idBtn.innerHTML = `${SOCIAL_CONFIG.wechat.id} <i class="fa-solid fa-copy"></i>`;
      }
    });
    $$('.social-kuaishou').forEach(el => {
      el.href = SOCIAL_CONFIG.kuaishou.homePage;
      const idBtn = el.querySelector('.copy-id-btn');
      if (idBtn) {
        const id = SOCIAL_CONFIG.kuaishou['快手号'];
        idBtn.dataset.copyId = id;
        idBtn.innerHTML = `${id} <i class="fa-solid fa-copy"></i>`;
      }
    });
    $$('.social-douyin').forEach(el => {
      el.href = SOCIAL_CONFIG.douyin.homePage;
      const idBtn = el.querySelector('.copy-id-btn');
      if (idBtn) {
        const id = SOCIAL_CONFIG.douyin.id;
        idBtn.dataset.copyId = id;
        idBtn.innerHTML = `${id} <i class="fa-solid fa-copy"></i>`;
      }
    });
    // 页脚同步
    const footQQ = $('.footer-contact li:nth-child(2)');
    if (footQQ) footQQ.innerHTML = `<i class="fa-brands fa-qq"></i> <span class="copy-id-btn" data-copy-id="${SOCIAL_CONFIG.qq.number}" data-label="QQ号" title="点击复制">QQ: ${SOCIAL_CONFIG.qq.number} <i class="fa-solid fa-copy"></i></span>`;
    const footWx = $('.footer-contact li:nth-child(3)');
    if (footWx) footWx.innerHTML = `<i class="fa-brands fa-weixin"></i> <span class="copy-id-btn" data-copy-id="${SOCIAL_CONFIG.wechat.id}" data-label="微信号" title="点击复制">微信: ${SOCIAL_CONFIG.wechat.id} <i class="fa-solid fa-copy"></i></span>`;
    const footEmail = $('.footer-contact li:nth-child(1)');
    if (footEmail) footEmail.innerHTML = `<i class="fa-solid fa-envelope"></i> <span class="copy-id-btn" data-copy-id="${SOCIAL_CONFIG.email}" data-label="邮箱" title="点击复制">${SOCIAL_CONFIG.email} <i class="fa-solid fa-copy"></i></span>`;
    // 页脚动态写入的复制按钮需重新绑定点击事件
    bindCopyButtons();

    // 平滑滚动修正（适配所有缩放比例和屏幕方向）
    $$('a[href^="#"]:not(.section-scroll-down)').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });

    // 方向感知滚动按钮：下箭头→下一个section，上箭头→上一个section
    $$('.section-scroll-down, .hero-scroll-hint').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isUp = btn.classList.contains('dir-up');
        const targetId = isUp ? (btn.dataset.prev || btn.dataset.next) : (btn.dataset.next || btn.dataset.prev);
        if (!targetId) return;
        scrollToSection(targetId);
      });
    });

    // 通用锚点滚动函数（适配所有缩放比例和屏幕方向）
    window.scrollToSection = function(id) {
      const target = document.getElementById(id);
      if (!target) return;
      const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    };
  });

  // ---------- 响应式断点调试工具（开发期用，生产可删除） ----------
  // 在浏览器 Console 里调用 window.__responsiveDebug() 查看当前断点与各网格列数
  (function () {
    const BREAKPOINTS = [
      { name: 'narrow', query: '(max-width: 719px)' },
      { name: 'medium', query: '(min-width: 720px) and (max-width: 1279px)' },
      { name: 'wide',   query: '(min-width: 1280px)' }
    ];
    const GRID_SELECTORS = [
      { sel: '.about-grid',       name: '关于我' },
      { sel: '.social-grid',      name: '联系方式' },
      { sel: '.blog-grid',        name: '博客文章' },
      { sel: '.resources-grid',   name: '资源分享' }
    ];
    function currentBreakpoint() {
      for (const b of BREAKPOINTS) {
        if (window.matchMedia(b.query).matches) return b.name;
      }
      return 'unknown';
    }
    function gridColumns(sel) {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      const cols = cs.gridTemplateColumns;
      if (!cols || cols === 'none') return 0;
      // computed style 下的 grid-template-columns 会被展开为具体轨道
      return cols.split(/\s+/).filter(Boolean).length;
    }
    function snapshot(tag) {
      const width = window.innerWidth;
      const bp = currentBreakpoint();
      const scale = Math.round((window.devicePixelRatio || 1) * 100) / 100;
      const parts = GRID_SELECTORS.map(g => {
        const cols = gridColumns(g.sel);
        return `${g.name}(${cols}列)`;
      }).join(' | ');
      const msg = `[RESPONSIVE${tag ? ' ' + tag : ''}] 视口 ${width}px · 断点 ${bp} · DPR ${scale} · ${parts}`;
      return msg;
    }
    window.__responsiveDebug = function () {
      const msg = snapshot('手动');
      console.log(msg);
      return msg;
    };
    // 监听媒体查询变化，断点切换时打印日志
    const handlers = [];
    BREAKPOINTS.forEach(b => {
      const mql = window.matchMedia(b.query);
      const handler = (e) => {
        if (e.matches) console.log(snapshot('← ' + b.name + ' 触发'));
      };
      if (mql.addEventListener) mql.addEventListener('change', handler);
      else mql.addListener(handler);
      handlers.push({ mql, handler });
    });
    // 页面加载后立刻打印一次当前状态
    console.log(snapshot('初始'));
    // 暴露清理方法
    window.__responsiveDebug.dispose = function () {
      handlers.forEach(h => {
        if (h.mql.removeEventListener) h.mql.removeEventListener('change', h.handler);
        else h.mql.removeListener(h.handler);
      });
    };
  })();
})();
