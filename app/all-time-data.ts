type Style = "射手" | "得分手" | "控場者" | "攻防一體" | "全能" | "禁區核心" | "護框者" | "衝擊籃框";
type Seed = readonly [name: string, cname: string, pos: string, ovr: number, style: Style];

const profiles: Record<Style, readonly number[]> = {
  射手: [98,92,88,68,96,88,74,52,40,54,88,55,97],
  得分手: [90,96,97,90,95,82,76,63,54,67,92,74,96],
  控場者: [87,90,91,70,98,98,81,58,43,60,91,67,96],
  攻防一體: [87,92,94,88,92,84,96,87,77,81,92,86,96],
  全能: [90,94,97,92,96,94,92,90,82,90,96,92,98],
  禁區核心: [70,88,98,90,80,90,69,95,88,97,82,98,95],
  護框者: [52,74,92,95,67,68,75,98,98,98,90,95,90],
  衝擊籃框: [77,86,98,98,94,83,83,67,59,73,98,88,95],
};

const styleNames: Record<Style, string> = {
  射手:"歷史級射手",得分手:"全能得分手",控場者:"傳奇控場者",攻防一體:"攻防一體核心",
  全能:"全能傳奇",禁區核心:"禁區進攻核心",護框者:"禁區守護者",衝擊籃框:"衝擊籃框核心",
};

function clamp(value: number) { return Math.max(40, Math.min(99, Math.round(value))); }
function player([name,cname,pos,ovr,style]:Seed) {
  const delta=(ovr-94)*.72;
  const ratings=profiles[style].map(value=>clamp(value+delta));
  return {name,cname,pos,height:"—",type:styleNames[style],ovr,threePT:ratings[0],MID:ratings[1],FIN:ratings[2],DNK:ratings[3],HAN:ratings[4],PAS:ratings[5],PDEF:ratings[6],IDEF:ratings[7],BLK:ratings[8],REB:ratings[9],ATH:ratings[10],STR:ratings[11],CLU:ratings[12]};
}
function roster(seeds: readonly Seed[]) { return seeds.map(player); }

export const ALL_TIME_DATA = {
  ATL: roster([
    ["Dominique Wilkins","多明尼克-威金斯","SF / PF",96,"衝擊籃框"],["Bob Pettit","鮑勃-佩提特","PF / C",95,"禁區核心"],["Trae Young","崔-楊","PG",92,"控場者"],
    ["Dikembe Mutombo","迪肯貝-穆湯波","C",93,"護框者"],["Joe Johnson","喬-強森","SG / SF",91,"得分手"],["Lou Hudson","盧-哈德森","SG / SF",91,"得分手"],
  ]),
  BOS: roster([
    ["Larry Bird","賴瑞-柏德","SF / PF",98,"全能"],["Bill Russell","比爾-羅素","C",98,"護框者"],["John Havlicek","約翰-哈夫利切克","SF / SG",96,"攻防一體"],
    ["Paul Pierce","保羅-皮爾斯","SF / SG",95,"得分手"],["Kevin McHale","凱文-麥克海爾","PF / C",95,"禁區核心"],["Jayson Tatum","傑森-塔圖姆","SF / PF",95,"攻防一體"],
  ]),
  BKN: roster([
    ["Jason Kidd","傑森-基德","PG",97,"控場者"],["Julius Erving","朱利爾斯-厄文","SF / SG",98,"衝擊籃框"],["Vince Carter","文斯-卡特","SG / SF",96,"衝擊籃框"],
    ["Buck Williams","巴克-威廉斯","PF / C",92,"護框者"],["Brook Lopez","布魯克-羅培茲","C",91,"禁區核心"],["Drazen Petrovic","德拉贊-彼得羅維奇","SG",92,"射手"],
  ]),
  CHA: roster([
    ["Kemba Walker","肯巴-沃克","PG",93,"控場者"],["Glen Rice","葛倫-萊斯","SF / SG",93,"射手"],["Larry Johnson","賴瑞-強森","PF / SF",94,"全能"],
    ["Alonzo Mourning","阿朗佐-莫寧","C",95,"護框者"],["Gerald Wallace","傑拉德-華勒斯","SF / PF",91,"攻防一體"],["LaMelo Ball","拉梅洛-鮑爾","PG / SG",90,"控場者"],
  ]),
  CHI: roster([
    ["Michael Jordan","麥可-喬丹","SG / SF",99,"攻防一體"],["Scottie Pippen","史考提-皮朋","SF / PG",97,"攻防一體"],["Derrick Rose","德瑞克-羅斯","PG",96,"衝擊籃框"],
    ["Dennis Rodman","丹尼斯-羅德曼","PF / SF",95,"護框者"],["Artis Gilmore","阿提斯-吉爾摩","C",95,"禁區核心"],["Jimmy Butler","吉米-巴特勒","SF / SG",94,"攻防一體"],
  ]),
  CLE: roster([
    ["LeBron James","雷霸龍-詹姆斯","SF / PG",99,"全能"],["Kyrie Irving","凱里-厄文","PG / SG",96,"得分手"],["Mark Price","馬克-普萊斯","PG",93,"射手"],
    ["Brad Daugherty","布萊德-道格提","C",93,"禁區核心"],["Kevin Love","凱文-洛夫","PF / C",92,"禁區核心"],["Evan Mobley","艾文-莫布里","PF / C",91,"護框者"],
  ]),
  DAL: roster([
    ["Dirk Nowitzki","德克-諾威斯基","PF / C",98,"得分手"],["Luka Doncic","盧卡-東契奇","PG / SF",97,"控場者"],["Jason Kidd","傑森-基德","PG",96,"控場者"],
    ["Steve Nash","史蒂夫-奈許","PG",96,"控場者"],["Mark Aguirre","馬克-阿奎爾","SF / PF",93,"得分手"],["Jason Terry","傑森-泰瑞","SG / PG",91,"射手"],
  ]),
  DEN: roster([
    ["Nikola Jokic","尼古拉-約基奇","C",98,"全能"],["Alex English","亞歷克斯-英格利許","SF",95,"得分手"],["Carmelo Anthony","卡梅羅-安東尼","SF / PF",96,"得分手"],
    ["Dikembe Mutombo","迪肯貝-穆湯波","C",94,"護框者"],["David Thompson","大衛-湯普森","SG / SF",95,"衝擊籃框"],["Jamal Murray","賈邁爾-莫瑞","PG / SG",92,"得分手"],
  ]),
  DET: roster([
    ["Isiah Thomas","以賽亞-湯瑪斯","PG",97,"控場者"],["Joe Dumars","喬-杜馬斯","SG / PG",95,"攻防一體"],["Grant Hill","格蘭特-希爾","SF / PG",96,"全能"],
    ["Ben Wallace","班-華勒斯","C / PF",96,"護框者"],["Bob Lanier","鮑勃-雷尼爾","C",95,"禁區核心"],["Chauncey Billups","昌西-畢拉普斯","PG",94,"控場者"],
  ]),
  GSW: roster([
    ["Stephen Curry","史蒂芬-柯瑞","PG / SG",99,"射手"],["Wilt Chamberlain","威爾特-張伯倫","C",99,"禁區核心"],["Kevin Durant","凱文-杜蘭特","SF / PF",98,"得分手"],
    ["Rick Barry","瑞克-貝瑞","SF",96,"得分手"],["Klay Thompson","克雷-湯普森","SG / SF",95,"射手"],["Draymond Green","德雷蒙-格林","PF / C",93,"攻防一體"],
  ]),
  HOU: roster([
    ["Hakeem Olajuwon","哈基姆-歐拉朱萬","C",99,"全能"],["James Harden","詹姆斯-哈登","SG / PG",97,"控場者"],["Moses Malone","摩西-馬龍","C",97,"禁區核心"],
    ["Yao Ming","姚明","C",95,"禁區核心"],["Tracy McGrady","崔西-麥葛雷迪","SG / SF",97,"得分手"],["Calvin Murphy","凱文-墨菲","PG",92,"射手"],
  ]),
  IND: roster([
    ["Reggie Miller","雷吉-米勒","SG / SF",96,"射手"],["Paul George","保羅-喬治","SF / SG",95,"攻防一體"],["Mel Daniels","梅爾-丹尼爾斯","C",95,"禁區核心"],
    ["Jermaine O'Neal","傑梅因-歐尼爾","PF / C",94,"護框者"],["Tyrese Haliburton","泰瑞斯-哈利伯頓","PG / SG",93,"控場者"],["Ron Artest","羅恩-亞泰斯特","SF / SG",94,"攻防一體"],
  ]),
  LAC: roster([
    ["Chris Paul","克里斯-保羅","PG",97,"控場者"],["Bob McAdoo","鮑勃-麥卡杜","C / PF",96,"得分手"],["Blake Griffin","布雷克-葛里芬","PF / C",95,"衝擊籃框"],
    ["Kawhi Leonard","科懷-雷納德","SF / SG",97,"攻防一體"],["Paul George","保羅-喬治","SF / SG",95,"攻防一體"],["DeAndre Jordan","德安德烈-喬丹","C",92,"護框者"],
  ]),
  LAL: roster([
    ["Magic Johnson","魔術強森","PG / SF",99,"控場者"],["Kobe Bryant","柯比-布萊恩","SG / SF",99,"攻防一體"],["Kareem Abdul-Jabbar","卡里姆-阿布杜-賈霸","C",99,"禁區核心"],
    ["Shaquille O'Neal","俠客-歐尼爾","C",99,"禁區核心"],["Jerry West","傑瑞-衛斯特","SG / PG",98,"全能"],["Elgin Baylor","艾爾金-貝勒","SF / PF",97,"得分手"],
  ]),
  MEM: roster([
    ["Marc Gasol","馬克-蓋索","C",94,"禁區核心"],["Pau Gasol","保羅-蓋索","PF / C",95,"禁區核心"],["Mike Conley","麥克-康利","PG",92,"控場者"],
    ["Ja Morant","賈-莫蘭特","PG",93,"衝擊籃框"],["Zach Randolph","查克-藍道夫","PF / C",93,"禁區核心"],["Tony Allen","東尼-艾倫","SG / SF",92,"攻防一體"],
  ]),
  MIA: roster([
    ["Dwyane Wade","德韋恩-韋德","SG / PG",98,"攻防一體"],["LeBron James","雷霸龍-詹姆斯","SF / PF",99,"全能"],["Alonzo Mourning","阿朗佐-莫寧","C",96,"護框者"],
    ["Chris Bosh","克里斯-波許","PF / C",94,"禁區核心"],["Jimmy Butler","吉米-巴特勒","SF / SG",95,"攻防一體"],["Tim Hardaway","提姆-哈達威","PG",94,"控場者"],
  ]),
  MIL: roster([
    ["Giannis Antetokounmpo","揚尼斯-安戴托昆波","PF / SF",99,"全能"],["Kareem Abdul-Jabbar","卡里姆-阿布杜-賈霸","C",99,"禁區核心"],["Oscar Robertson","奧斯卡-羅伯森","PG / SG",98,"全能"],
    ["Ray Allen","雷-艾倫","SG",96,"射手"],["Sidney Moncrief","席德尼-蒙克里夫","SG / PG",95,"攻防一體"],["Khris Middleton","克里斯-米道頓","SF / SG",92,"得分手"],
  ]),
  MIN: roster([
    ["Kevin Garnett","凱文-賈奈特","PF / C",98,"全能"],["Anthony Edwards","安東尼-愛德華茲","SG / SF",95,"衝擊籃框"],["Kevin Love","凱文-洛夫","PF / C",93,"禁區核心"],
    ["Karl-Anthony Towns","卡爾-安東尼-唐斯","C / PF",94,"得分手"],["Stephon Marbury","史蒂芬-馬布里","PG",92,"控場者"],["Rudy Gobert","魯迪-戈貝爾","C",93,"護框者"],
  ]),
  NOP: roster([
    ["Chris Paul","克里斯-保羅","PG",97,"控場者"],["Anthony Davis","安東尼-戴維斯","PF / C",97,"全能"],["Zion Williamson","錫安-威廉森","PF / C",93,"衝擊籃框"],
    ["Jrue Holiday","朱-哈勒戴","PG / SG",93,"攻防一體"],["David West","大衛-衛斯特","PF",91,"禁區核心"],["Brandon Ingram","布蘭登-英格拉姆","SF / PF",91,"得分手"],
  ]),
  NYK: roster([
    ["Patrick Ewing","派翠克-尤英","C",97,"禁區核心"],["Walt Frazier","華特-弗雷澤","PG / SG",97,"攻防一體"],["Willis Reed","威利斯-瑞德","C / PF",96,"禁區核心"],
    ["Carmelo Anthony","卡梅羅-安東尼","SF / PF",96,"得分手"],["Bernard King","伯納德-金恩","SF",95,"得分手"],["Jalen Brunson","傑倫-布朗森","PG",94,"控場者"],
  ]),
  OKC: roster([
    ["Kevin Durant","凱文-杜蘭特","SF / PF",99,"得分手"],["Russell Westbrook","羅素-衛斯特布魯克","PG",97,"衝擊籃框"],["Gary Payton","蓋瑞-裴頓","PG",97,"攻防一體"],
    ["Shai Gilgeous-Alexander","謝伊-吉爾傑斯-亞歷山大","PG / SG",98,"得分手"],["Shawn Kemp","尚恩-坎普","PF / C",95,"衝擊籃框"],["James Harden","詹姆斯-哈登","SG / PG",94,"控場者"],
  ]),
  ORL: roster([
    ["Shaquille O'Neal","俠客-歐尼爾","C",98,"禁區核心"],["Penny Hardaway","潘尼-哈達威","PG / SG",96,"全能"],["Dwight Howard","德懷特-霍華德","C",97,"護框者"],
    ["Tracy McGrady","崔西-麥葛雷迪","SG / SF",97,"得分手"],["Paolo Banchero","保羅-班凱羅","PF / SF",92,"全能"],["Nikola Vucevic","尼古拉-武切維奇","C",91,"禁區核心"],
  ]),
  PHI: roster([
    ["Allen Iverson","艾倫-艾佛森","SG / PG",98,"得分手"],["Julius Erving","朱利爾斯-厄文","SF / SG",98,"衝擊籃框"],["Wilt Chamberlain","威爾特-張伯倫","C",99,"禁區核心"],
    ["Charles Barkley","查爾斯-巴克利","PF / SF",98,"全能"],["Joel Embiid","喬爾-恩比德","C",97,"禁區核心"],["Moses Malone","摩西-馬龍","C",97,"禁區核心"],
  ]),
  PHX: roster([
    ["Steve Nash","史蒂夫-奈許","PG",98,"控場者"],["Charles Barkley","查爾斯-巴克利","PF / SF",98,"全能"],["Devin Booker","德文-布克","SG / PG",95,"得分手"],
    ["Amar'e Stoudemire","阿瑪雷-史陶德邁爾","PF / C",95,"衝擊籃框"],["Kevin Johnson","凱文-強森","PG",94,"控場者"],["Shawn Marion","尚恩-馬里昂","SF / PF",94,"攻防一體"],
  ]),
  POR: roster([
    ["Clyde Drexler","克萊德-崔斯勒","SG / SF",97,"全能"],["Damian Lillard","達米安-里拉德","PG",97,"射手"],["Bill Walton","比爾-華頓","C",97,"禁區核心"],
    ["LaMarcus Aldridge","拉馬庫斯-艾德里奇","PF / C",94,"禁區核心"],["Brandon Roy","布蘭登-羅伊","SG / SF",94,"得分手"],["Arvydas Sabonis","阿維達斯-薩波尼斯","C",93,"禁區核心"],
  ]),
  SAC: roster([
    ["Oscar Robertson","奧斯卡-羅伯森","PG / SG",98,"全能"],["Chris Webber","克里斯-韋伯","PF / C",96,"全能"],["DeMarcus Cousins","德馬庫斯-考辛斯","C",95,"禁區核心"],
    ["Peja Stojakovic","佩賈-史托亞科維奇","SF / PF",94,"射手"],["Mitch Richmond","米契-里奇蒙","SG",95,"得分手"],["De'Aaron Fox","德亞倫-福克斯","PG",93,"衝擊籃框"],
  ]),
  SAS: roster([
    ["Tim Duncan","提姆-鄧肯","PF / C",99,"全能"],["David Robinson","大衛-羅賓森","C",98,"護框者"],["Kawhi Leonard","科懷-雷納德","SF / SG",97,"攻防一體"],
    ["George Gervin","喬治-葛文","SG / SF",97,"得分手"],["Tony Parker","東尼-帕克","PG",95,"控場者"],["Manu Ginobili","馬努-吉諾比利","SG / PG",95,"全能"],
  ]),
  TOR: roster([
    ["Vince Carter","文斯-卡特","SG / SF",96,"衝擊籃框"],["Kawhi Leonard","科懷-雷納德","SF / SG",97,"攻防一體"],["Kyle Lowry","凱爾-羅瑞","PG",94,"控場者"],
    ["Chris Bosh","克里斯-波許","PF / C",94,"禁區核心"],["DeMar DeRozan","德瑪爾-德羅展","SG / SF",95,"得分手"],["Pascal Siakam","帕斯卡-席亞康","PF / SF",93,"全能"],
  ]),
  UTA: roster([
    ["John Stockton","約翰-史塔克頓","PG",98,"控場者"],["Karl Malone","卡爾-馬龍","PF",98,"禁區核心"],["Donovan Mitchell","多諾萬-米契爾","SG / PG",94,"得分手"],
    ["Rudy Gobert","魯迪-戈貝爾","C",94,"護框者"],["Adrian Dantley","阿德里安-丹特利","SF / PF",95,"得分手"],["Pete Maravich","皮特-馬拉維奇","SG / PG",96,"控場者"],
  ]),
  WAS: roster([
    ["Wes Unseld","衛斯-昂塞爾德","C / PF",96,"護框者"],["Elvin Hayes","艾爾文-海耶斯","PF / C",97,"禁區核心"],["Gilbert Arenas","吉爾伯特-亞瑞納斯","PG / SG",95,"得分手"],
    ["John Wall","約翰-沃爾","PG",94,"控場者"],["Bradley Beal","布萊德利-比爾","SG / PG",93,"得分手"],["Earl Monroe","厄爾-孟洛","SG / PG",95,"控場者"],
  ]),
} as const;
