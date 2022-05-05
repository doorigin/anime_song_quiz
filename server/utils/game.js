const fs = require('fs');
const path = require('path');
const formatMessage = require('./messages');
const { 
    userJoin, 
    getCurrentUser, 
    userLeave, 
    getRoomUsers,
    updateScores,
    resetScores,
    setRanks,
    getRank,
    getWinner
} = require('./users');
botname = "domobot"
var countdown = 0
answer = 0

words = [
    [['소아온','소드아트온라인','sao'], 'https://staging.animethemes.moe/video/SwordArtOnline-ED1.webm'],
    [['모노가타리 세컨드 시즌', '모노가타리'], 'https://staging.animethemes.moe/video/MonogatariSS-OP1.webm'],
    [['데어라', '데이트 어 라이브'], 'https://staging.animethemes.moe/video/DateALive-ED1.webm'],
    [['카구야', '카구야님은 고백 받고 싶어'],'https://staging.animethemes.moe/video/KaguyaSamaWaKokurasetai-ED1.webm'],
    [['페스나', '페이트 스테이 나이트'],'https://staging.animethemes.moe/video/FateStayNightOVA-ED1.webm'],
    [['페그오', '페이트 그랜드 오더'],'https://staging.animethemes.moe/video/FateGrandOrderBabylonia-ED1.webm'],
    [['바이올렛 에버가든'],'https://staging.animethemes.moe/video/VioletEvergarden-ED1.webm'],
    [['데스노트', 'death note'],'https://staging.animethemes.moe/video/DeathNote-OP1.webm'],
    [['노 게임 노 라이프', '노겜노라', 'ngnl'],'https://staging.animethemes.moe/video/NoGameNoLife-OP1.webm'],
    [['니세코이'],'https://staging.animethemes.moe/video/Nisekoi-OP1.webm'],
    [['울려라 유포니엄'], 'https://staging.animethemes.moe/video/HibikeEuphonium-OP1.webm'],
    [['코바야시네 메이드래곤', '메이드래곤', '코바야시'], 'https://staging.animethemes.moe/video/KobayashiSanChiNoMaidDragon-OP1.webm'],
    [['신세기 에반게리온', '네온 제네시스 에반게리온', '에반게리온'],'https://staging.animethemes.moe/video/NeonGenesisEvangelion-OP1.webm'],
    [['무직전생'],'https://staging.animethemes.moe/video/MushokuTensei-OP1-NCBD1080.webm'],
    [['86', '에이티식스'],'https://staging.animethemes.moe/video/86-OP1-NCBD1080.webm'],
    [['나루토', '나루토질풍전'], 'https://animethemes.moe/video/NarutoShippuuden-OP16.webm'], 
    [['아오하라이드'], 'https://animethemes.moe/video/AoHaruRide-OP1.webm'], 
    [['은혼', '긴타마'], 'https://animethemes.moe/video/GintamaS3-OP2-NCBD1080.webm'], 
    [['하이큐', '하이큐!', '하이큐!!'], 'https://animethemes.moe/video/HaikyuuS4-ED1.webm'], 
    [['은혼', "은혼'", '긴타마', "긴타마'"], 'https://animethemes.moe/video/GintamaS2-ED1-NCBD1080.webm'], 
    [['하이큐', '하이큐!', '하이큐!!'], 'https://animethemes.moe/video/Haikyuu-OP1.webm'], 
    [['나의 히어로 아카데미아', '나히아', '나의 히어로 아카데미아 2기', '나히아 2기'], 'https://animethemes.moe/video/BokuNoHeroAcademiaS2-OP1-NCBD1080.webm'], 
    [['쏘아올린 불꽃, 밑에서 볼까? 옆에서 볼까?', '쏘아올린 불꽃 밑에서 볼까? 옆에서 볼까?', '쏘아올린 불꽃, 밑에서 볼까 옆에서 볼까', '쏘아올린 불꽃 밑에서 볼까 옆에서 볼까'], 'https://animethemes.moe/video/UchiageHanabi-ED1.webm'], 
    [['혈계전선'], 'https://animethemes.moe/video/KekkaiSensen-ED1.webm'], 
    [['너의이름은', '키미노나와'], 'https://animethemes.moe/video/KimiNoNaWa-OP1.webm'], 
    [['날씨의아이', '텐키노코'], 'https://animethemes.moe/video/TenkiNoKo-ED1.webm'], 
    [['날씨의아이', '텐키노코'], 'https://animethemes.moe/video/TenkiNoKo-ED2.webm'], 
    [['도쿄구울', '도쿄구울루트A', '도쿄구울루트에이'], 'https://animethemes.moe/video/TokyoGhoulRootA-ED1.webm'], 
    [['4월은 너의 거짓말', '4월구라'], 'https://animethemes.moe/video/KimiUso-OP1.webm'], 
    [['4월은 너의 거짓말', '4월구라'], 'https://animethemes.moe/video/KimiUso-OP2.webm'], 
    [['4월은 너의 거짓말', '4월구라'], 'https://animethemes.moe/video/KimiUso-ED1.webm'], 
    [['4월은 너의 거짓말', '4월구라'], 'https://animethemes.moe/video/KimiUso-ED2.webm'], 
    [['소드아트온라인', '소아온'], 'https://animethemes.moe/video/SwordArtOnline-OP1.webm'], 
    [['소드아트온라인', '소아온', '소드아트온라인2기', '소아온2기'], 'https://animethemes.moe/video/SwordArtOnlineS2-ED3.webm'], 
    [['바이올렛 에버가든'], 'https://animethemes.moe/video/VioletEvergardenGaiden-ED1.webm'], 
    [['바이올렛 에버가든'], 'https://animethemes.moe/video/VioletEvergarden-OP1-Lyrics.webm'], 
    [['바이올렛 에버가든'], 'https://animethemes.moe/video/VioletEvergarden-ED1v2.webm'], 
    [['바이올렛 에버가든', '바이올렛 에버가든 극장판'], 'https://animethemes.moe/video/VioletEvergardenMovie-ED1.webm'], 
    [['너에게 닿기를'], 'https://animethemes.moe/video/KimiNiTodoke-OP1.webm'], 
    [['어떤 과학의 초전자포', '어과초'], 'https://animethemes.moe/video/ToaruKagakuNoRailgun-OP1.webm'], 
    [['어떤 과학의 초전자포', '어과초'], 'https://animethemes.moe/video/ToaruKagakuNoRailgun-OP2.webm'], 
    [['어떤 과학의 초전자포', '어과초', '어떤 과학의 초전자포 T'], 'https://animethemes.moe/video/ToaruKagakuNoRailgunT-OP1-NCBD1080.webm'], 
    [['어떤 과학의 초전자포', '어과초', '어떤 과학의 초전자포 T'], 'https://animethemes.moe/video/ToaruKagakuNoRailgunT-OP2-NCBD1080.webm'], 
    [['어떤 마술의 금서목록', '어마금'], 'https://animethemes.moe/video/ToaruMajutsuNoIndexS2-OP1.webm'], 
    [['강철의 연금술사', '강연금'], 'https://animethemes.moe/video/FullmetalAlchemistBrotherhood-OP1.webm'], 
    [['강철의 연금술사', '강연금'], 'https://animethemes.moe/video/FullmetalAlchemistBrotherhood-OP2.webm'], 
    [['강철의 연금술사', '강연금'], 'https://animethemes.moe/video/FullmetalAlchemistBrotherhood-OP4.webm'], 
    [['강철의 연금술사', '강연금'], 'https://animethemes.moe/video/FullmetalAlchemistBrotherhood-OP5.webm'], 
    [['강철의 연금술사', '강연금'], 'https://animethemes.moe/video/FullmetalAlchemistBrotherhood-ED1.webm'], 
    [['강철의 연금술사', '강연금'], 'https://animethemes.moe/video/FullmetalAlchemistBrotherhood-ED4.webm'], 
    [['암살교실'], 'https://animethemes.moe/video/AnsatsuKyoushitsu-ED1.webm'], 
    [['귀멸의 칼날', '귀멸의 칼날 극장판', '귀멸의 칼날 무한열차 편'], 'https://animethemes.moe/video/KimetsuNoYaibaMugenResshaTV-OP1.webm'], 
    [['귀멸의 칼날'], 'https://animethemes.moe/video/KimetsuNoYaibaMugenResshaTV-OP1.webm'], 
    [['귀멸의 칼날'], 'https://animethemes.moe/video/KimetsuNoYaiba-ED2-Lyrics.webm'], 
    [['카구야님은 고백 받고 싶어', '카구야 님은 고백받고 싶어?', '카구야 님은 고백받고 싶어 ~천재들의 연애 두뇌전~'], 'https://animethemes.moe/video/KaguyaSamaWaKokurasetaiS2-OP1-NCBD1080.webm'], 
    [['바라카몬'], 'https://animethemes.moe/video/Barakamon-OP1.webm'], 
    [['쓰레기의 본망', '쓰본망'], 'https://animethemes.moe/video/KuzuNoHonkai-OP1-NCBD1080.webm'], 
    [['이 멋진 세계에 축복을!', '이 멋진 세계에 축복을', '코노스바라시세카이니슈쿠후쿠오', '코노스바'], 'https://animethemes.moe/video/Konosuba-OP1.webm'], 
    [['이 멋진 세계에 축복을!', '이 멋진 세계에 축복을', '코노스바라시세카이니슈쿠후쿠오', '코노스바'], 'https://animethemes.moe/video/KonosubaS2-OP1.webm'], 
    [['이 멋진 세계에 축복을!', '이 멋진 세계에 축복을', '이 멋진 세계에 축복을! 붉은 전설', '이 멋진 세계에 축복을 붉은 전설', '코노스바 ', '코노스바라시세카이니슈쿠후쿠오', '코노스바 붉은전설', '코노스바 극장판', '이 멋진 세계에 축복을! 극장판', '이 멋진 세계에 축복을 극장판'], 'https://animethemes.moe/video/KonosubaKurenaiDensetsu-ED2.webm'], 
    [['역시 내 청춘 러브코메디는 잘못됐다', '역시 내 청춘 러브코미디는 잘못됐다', '내청코'], 'https://animethemes.moe/video/OreGairu-OP1.webm'], 
    [['역시 내 청춘 러브코메디는 잘못됐다', '역시 내 청춘 러브코미디는 잘못됐다', '내청코', '내청코 2기', '역시 내 청춘 러브 코미디는 잘못됐다 2기', '역시 내 청춘 러브코메디는 잘못됐다 2기'], 'https://animethemes.moe/video/OreGairuS2-OP1.webm'], 
    [['역시 내 청춘 러브코메디는 잘못됐다', '역시 내 청춘 러브코미디는 잘못됐다', '내청코', '내청코 2기', '역시 내 청춘 러브 코미디는 잘못됐다 2기', '역시 내 청춘 러브코메디는 잘못됐다 2기'], 'https://animethemes.moe/video/OreGairuS2-ED1.webm'], 
    [['아이돌마스터', '아이마스', 'Idolm@ster'], 'https://animethemes.moe/video/Idolmaster-OP1.webm'], 
    [['아이돌마스터', '아이마스', 'Idolm@ster'], 'https://animethemes.moe/video/Idolmaster-OP2.webm'], 
    [['아이돌마스터', '아이마스', 'Idolm@ster'], 'https://animethemes.moe/video/Idolmaster-ED20.webm'], 
    [['아이돌마스터', '아이마스', 'Idolm@ster'], 'https://animethemes.moe/video/Idolmaster-ED25.webm'], 
    [['아이돌마스터 신데렐라걸즈', '아이돌마스터 신데렐라걸스', '신데마스'], 'https://animethemes.moe/video/IdolmasterCinderellaGirls-OP1.webm'], 
    [['아이돌마스터 신데렐라걸즈', '아이돌마스터 신데렐라걸스', '신데마스'], 'https://animethemes.moe/video/IdolmasterCinderellaGirls-OP2.webm'], 
    [['아이돌마스터 신데렐라걸즈', '아이돌마스터 신데렐라걸스', '신데마스'], 'https://animethemes.moe/video/IdolmasterCinderellaGirlsS2-OP2.webm'], 
    [['아이돌마스터', '아이마스', 'Idolm@ster'], 'https://animethemes.moe/video/Idolmaster-ED4.webm'], 
    [['원피스'], 'https://animethemes.moe/video/OnePiece-OP13-NCBD.webm'], 
    [['여친, 빌리겠습니다', '여친 빌리겠습니다', '렌탈여친'], 'https://animethemes.moe/video/Kanokari-OP1.webm'], 
    [['문호 스트레이독스'], 'https://animethemes.moe/video/BungouStrayDogs-ED1-NCBD1080.webm'], 
    [['문호 스트레이독스', '문호 스트레이독스 왕!', '문호 스트레이독스 2기'], 'https://animethemes.moe/video/BungouStrayDogsWan-ED2.webm'], 
    [['re:제로부터 시작하는 이세계 생활', '리 제로부터 시작하는 이세계 생활'], 'https://animethemes.moe/video/ReZero-ED1v2.webm'], 
    [['re:제로부터 시작하는 이세계 생활', '리 제로부터 시작하는 이세계 생활'], 'https://animethemes.moe/video/ReZero-ED3.webm'], 
    [['re:제로부터 시작하는 이세계 생활', '리 제로부터 시작하는 이세계 생활', 're:제로부터 시작하는 이세계 생활 2기', '리 제로부터 시작하는 이세계 생활 2기'], 'https://animethemes.moe/video/ReZeroS2-OP1-NCBD1080.webm'], 
    [['일주일간 친구'], 'https://animethemes.moe/video/IsshuukanFriends-ED1-Lyrics.webm'], 
    [['장난을 잘 치는 타카기양'], 'https://animethemes.moe/video/Takagi3S2-ED1-NCBD1080.webm'], 
    [['전생했더니 슬라임이었던 건에 대하여', '전생슬'], 'https://animethemes.moe/video/Tensura-OP1-NCBD1080.webm'], 
    [['무직전생'], 'https://animethemes.moe/video/MushokuTensei-OP1.webm'], 
    [['소드아트온라인', '소아온'], 'https://animethemes.moe/video/SwordArtOnline-OP2.webm'], 
    [['소드아트온라인', '소아온', '소드아트온라인2기', '소아온2기'], 'https://animethemes.moe/video/SwordArtOnlineS2-OP1.webm'], 
    [['소드아트온라인', '소아온', '소드아트온라인2기', '소아온2기'], 'https://animethemes.moe/video/SwordArtOnlineS2-OP2.webm'], 
    [['소드아트온라인', '소아온', '소드아트온라인2기', '소아온2기'], 'https://animethemes.moe/video/SwordArtOnlineS2-ED1.webm'], 
    [['소드아트온라인', '소아온', '소드아트온라인 앨리시제이션', '소아온 앨리시제이션'], 'https://animethemes.moe/video/SwordArtOnlineAlicization-OP1-NCBD1080.webm'], 
    [['소드아트온라인', '소아온', '소드아트온라인 앨리시제이션', '소아온 앨리시제이션'], 'https://animethemes.moe/video/SwordArtOnlineAlicization-OP2-NCBD1080.webm'], 
    [['소드아트온라인', '소아온', '소드아트온라인 앨리시제이션', '소아온 앨리시제이션', '소드아트온라인 앨리시제이션 WOU', '소아온 앨리시제이션 WOU'], 'https://animethemes.moe/video/SwordArtOnlineAlicizationS2-OP1-NCBD1080.webm'], 
    [['소드아트온라인', '소아온', '소드아트온라인 앨리시제이션', '소아온 앨리시제이션', '소드아트온라인 앨리시제이션 WOU', '소아온 앨리시제이션 WOU'], 'https://animethemes.moe/video/SwordArtOnlineAlicizationS3-OP1-NCBD1080.webm'], 
    [['블랙클로버'], 'https://animethemes.moe/video/BlackClover-OP10.webm'], 
    [['코미 양은, 커뮤증입니다', '코미 양은 커뮤증입니다'], 'https://animethemes.moe/video/KomiSanWaKomyushouDesu-OP1.webm'], 
    [['도쿄 리벤져스', '도쿄 리벤저스'], 'https://animethemes.moe/video/TokyoRevengers-OP1.webm'], 
    [['불꽃소방대'], 'https://animethemes.moe/video/EnenNoShouboutai-OP1-NCBD1080.webm'], 
    [['불꽃소방대', '불꽃소방대 2기'], 'https://animethemes.moe/video/EnenNoShouboutaiS2-OP1-NCBD1080.webm'], 
    [['주술회전'], 'https://animethemes.moe/video/JujutsuKaisen-OP1.webm'], 
    [['코바야시네 메이드래곤', '고바야시네 메이드래곤'], 'https://animethemes.moe/video/KobayashiSanChiNoMaidDragon-OP1-NCBD1080.webm'], 
    [['코바야시네 메이드래곤', '고바야시네 메이드래곤', '코바야시네 메이드래곤 S', '고바야시네  메이드래곤 S'], 'https://animethemes.moe/video/KobayashiSanChiNoMaidDragonS2-OP1.webm'], 
    [['도로로'], 'https://animethemes.moe/video/Dororo2019-ED2-NCBD1080.webm'], 
    [['도로로'], 'https://animethemes.moe/video/Dororo2019-ED1-NCBD1080.webm']]

var updateUserScoreRank = (io, user) => {
    // Set player rank
    setRanks(getRoomUsers(user.room))

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    })
}

class Game {
    constructor(totalRounds, roundTime) {
        this.totalRounds = totalRounds
        this.round = 1
        this.roundTime = roundTime
    }

    questionpool = words;
    questions = [];
    state = true;
    ready = new Set();
    counter = 90

    startGame = (io, user) => {
        io.to(user.room).emit(
            'message', 
            formatMessage(botname,`${user.username} has pressed game start`)
            );

        // reset scores
        resetScores()

        // Set player rank
        setRanks(getRoomUsers(user.room))

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

        // Send users round info
        io.to(user.room).emit('roundInfo', {
            currentRound: this.round,
            totalRounds: this.totalRounds
        })
    }

    // add n questions [answer, image]
    addQuestions = () => {
        const nums = new Set();
        while(nums.size !== this.totalRounds) {
        nums.add(Math.floor(Math.random() * this.questionpool.length))
        };
        for (const x of [...nums]) {
            this.questions.push(this.questionpool[x])
        }
        console.log("Added questions")
        console.log(this.questions)
    }

    runRound = (io, user) => {
        this.counter = this.roundTime

        // Send users round info
        io.to(user.room).emit('roundInfo', {
            currentRound: this.round,
            totalRounds: this.totalRounds
        })
            
        // change answer
        answer = this.questions[0][0];

        // countdown on
        countdown = setInterval(() => {
            io.to(user.room).emit('counter', this.counter);
            console.log(this.counter)
            this.counter--;
            if (this.counter===-1) {
                this.counter = this.roundTime
                this.timeUp(io, user);
            }
        }, 1000);

        // clear canvas
        io.to(user.room).emit('video', {video: false, src: this.questions[0][1], id: this.round});

        // send question video
        io.to(user.room).emit('video', { video: true, src: this.questions[0][1], id: this.round});
        console.log(this.questions[0][1])
    }

    answered = (io, user) => {
        io.to(user.room).emit('message', formatMessage(botname, `${user.username} right answer`));

        answer = "";
        this.counter = this.roundTime

        // clear countdown
        clearInterval(countdown);

        // add round
        this.round++;

        // ready = 0
        this.ready.clear()

        // update scores and rank
        updateScores(user, 10);
        updateUserScoreRank(io, user);

        // run next round if round left
        if (this.round < this.totalRounds+1) {
            this.questions.shift();
            this.runRound(io, user);
        } else {
            this.endGame(io, user)
        }
    }

    timeUp = (io, user) => {
        io.emit('message', formatMessage(botname, `Time is up! The answer was ${answer[0]}`));

        answer = "";

        // clear countdown
        clearInterval(countdown);

        // add round
        this.round++;

        // ready = 0
        this.ready.clear()
        
        // some Interval

        // run next round if round left
        if (this.round < this.totalRounds+1) {
            this.questions.shift();
            this.runRound(io, user);
        } else {
            this.endGame(io, user)
        }
    }

    endGame(io, user) {
        console.log('game end');
        clearInterval(countdown);
        io.to(user.room).emit('message', formatMessage(botname, `Game Over`));
        io.to(user.room).emit('message', formatMessage(botname, `Winner is ${getWinner()}`));
        io.to(getRoomUsers(user.room)[0].id).emit('showStartButton');
    }

}

module.exports = {Game, updateUserScoreRank}