// 奖品配置
const prizes = [
    {
        name: "一等奖",
        subPrizes: [
            { name: "水杯", probability: 0.5 },
            { name: "网易云音乐会员", probability: 0.5 }
        ],
        count: Infinity, // 一等奖中的具体奖品数量独立计算
        probability: 0.10,
        color: "linear-gradient(135deg, #ffd89b 0%, #19547b 100%)"
    },
    {
        name: "二等奖\n薯片",
        count: 4,
        probability: 0.20,
        color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
        name: "三等奖\n茶包",
        count: 7,
        probability: 0.30,
        color: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)"
    },
    {
        name: "参与奖\n小饼干+贴纸",
        count: Infinity, // 无限数量
        probability: 0.40,
        color: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
    }
];

// DOM元素
const drawButton = document.getElementById('drawButton');
const resultDiv = document.getElementById('result');
const prizeResultDiv = document.getElementById('prizeResult');
const welcomeSection = document.getElementById('welcomeSection');

// 抽奖函数
function drawPrize() {
    // 生成0到1之间的随机数
    const randomNumber = Math.random();
    
    let cumulativeProbability = 0;
    let selectedPrize = null;
    
    // 根据概率选择奖品
    for (let i = 0; i < prizes.length; i++) {
        cumulativeProbability += prizes[i].probability;
        if (randomNumber <= cumulativeProbability) {
            selectedPrize = prizes[i];
            break;
        }
    }
    
    // 如果由于浮点数精度问题没有选中任何奖品，默认为参与奖
    if (!selectedPrize) {
        selectedPrize = prizes[prizes.length - 1]; // 参与奖
    }
    
    // 对于一等奖，进一步决定是水杯还是网易云音乐会员
    if (selectedPrize.name === "一等奖" && selectedPrize.subPrizes) {
        const subRandom = Math.random();
        let subCumulative = 0;
        for (let j = 0; j < selectedPrize.subPrizes.length; j++) {
            subCumulative += selectedPrize.subPrizes[j].probability;
            if (subRandom <= subCumulative) {
                selectedPrize.subPrize = selectedPrize.subPrizes[j];
                break;
            }
        }
    }
    
    return selectedPrize;
}

// 显示结果
function showResult(prize) {
    // 设置奖品文本和背景色
    let displayText = prize.name;
    
    // 特殊处理一等奖中的子奖品
    if (prize.subPrize) {
        displayText += "\n" + prize.subPrize.name;
        
        // 特别处理网易云音乐会员
        if (prize.subPrize.name === "网易云音乐会员") {
            displayText += "\n\n网易云音乐会员兑换须知\n\n• 最高可领取3个月会员时长\n\n重要限制条款：\n\n会员福利包含黑胶VIP、SVIP随机天数或音质体验卡，系统随机发放其一\n每个网易云音乐账号仅限兑换1次黑胶福利，请谨慎选择领取\n兑换链接为个人专属，分享后可能导致奖励被他人领取\n活动截止时间：2025年12月17日0点，数量有限，先到先得\n点击此处兑换您的会员权益\n\n注：所有奖品数量有限，抽完即止。活动最终解释权归主办方所有。";
        }
    }
    
    prizeResultDiv.textContent = displayText;
    prizeResultDiv.style.background = prize.color;
    
    // 显示结果区域
    resultDiv.classList.remove('hidden');
    
    // 显示欢迎信息
    welcomeSection.classList.remove('hidden');
    
    // 滚动到结果区域
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// 抽奖按钮点击事件
drawButton.addEventListener('click', function() {
    // 禁用按钮防止重复点击
    drawButton.disabled = true;
    drawButton.textContent = "抽奖中...";
    
    // 添加一点延迟增加期待感
    setTimeout(function() {
        const prize = drawPrize();
        showResult(prize);
        
        // 恢复按钮状态，但不显示"再抽一次"
        drawButton.disabled = false;
        drawButton.textContent = "开始抽奖";
    }, 1500);
});