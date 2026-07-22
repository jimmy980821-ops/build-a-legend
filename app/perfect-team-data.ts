export type CourtPosition = "PG" | "SG" | "SF" | "PF" | "C";

export type TeamEraPlayer = {
  name: string;
  cname: string;
  team: string;
  era: string;
  pos: string;
  positions: CourtPosition[];
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
};

export type TeamEra = {
  team: string;
  era: string;
  label: string;
  players: TeamEraPlayer[];
};

type Seed = [string, string, string, number, number, number, number, number];

const positions = (pos: string) => pos.split(" / ") as CourtPosition[];
const roster = (team: string, era: string, seeds: Seed[]): TeamEraPlayer[] =>
  seeds.map(([name, cname, pos, pts, reb, ast, stl, blk]) => ({
    name, cname, team, era, pos, positions: positions(pos), pts, reb, ast, stl, blk,
  }));

export const COURT_POSITIONS: CourtPosition[] = ["PG", "SG", "SF", "PF", "C"];

export const TEAM_ERAS: TeamEra[] = [
  {team:"PHI",era:"2010s",label:"費城 76 人",players:roster("PHI","2010s",[
    ["Ben Simmons","班・西蒙斯","PG / PF",16.3,8.4,8.0,1.7,.8],
    ["Jrue Holiday","朱・哈勒戴","PG / SG",17.7,4.2,8.0,1.6,.4],
    ["Lou Williams","路・威廉斯","PG / SG",14.9,2.4,3.5,.8,.2],
    ["JJ Redick","J.J.・瑞迪克","SG",18.1,2.4,3.0,.5,.1],
    ["Andre Iguodala","安德烈・伊古達拉","SG / SF",14.1,6.1,5.5,1.7,.6],
    ["Robert Covington","羅伯特・柯文頓","SF / PF",12.9,6.5,1.5,1.7,1.0],
    ["Tobias Harris","托拜亞斯・哈里斯","SF / PF",18.2,7.9,2.9,.7,.5],
    ["Thaddeus Young","賽迪斯・楊","PF / SF",15.3,7.5,1.6,1.8,.7],
    ["Joel Embiid","喬爾・恩比德","C",27.5,13.6,3.7,.7,1.9],
    ["Nerlens Noel","諾倫斯・諾爾","C / PF",11.1,8.1,1.7,1.8,1.5],
  ])},
  {team:"CHI",era:"1990s",label:"芝加哥公牛",players:roster("CHI","1990s",[
    ["Ron Harper","朗・哈珀","PG / SG",11.2,4.3,3.3,1.3,.5],
    ["B.J. Armstrong","B.J.・阿姆斯壯","PG",14.8,2.1,3.9,1.0,.1],
    ["Michael Jordan","麥可・喬丹","SG / SF",32.6,6.7,5.5,2.8,1.0],
    ["Steve Kerr","史蒂夫・柯爾","SG / PG",8.6,1.5,2.3,.5,.1],
    ["Scottie Pippen","史考提・皮朋","SF / PG",22.0,8.7,5.6,2.9,.8],
    ["Toni Kukoc","東尼・庫科奇","SF / PF",13.1,4.0,3.5,1.0,.3],
    ["Dennis Rodman","丹尼斯・羅德曼","PF / C",5.7,15.0,2.9,.6,.6],
    ["Horace Grant","霍瑞斯・葛蘭特","PF / C",15.1,11.0,3.4,1.2,1.2],
    ["Bill Cartwright","比爾・卡萊特","C",9.6,6.2,1.2,.5,.5],
    ["Luc Longley","路克・朗利","C",9.1,5.1,1.9,.4,1.1],
  ])},
  {team:"LAL",era:"2000s",label:"洛杉磯湖人",players:roster("LAL","2000s",[
    ["Derek Fisher","德瑞克・費雪","PG",11.5,3.0,4.4,1.5,.1],
    ["Gary Payton","蓋瑞・裴頓","PG / SG",14.6,4.2,5.5,1.2,.2],
    ["Kobe Bryant","柯比・布萊恩","SG / SF",35.4,5.3,4.5,1.8,.4],
    ["Rick Fox","瑞克・福克斯","SF / SG",13.0,4.0,3.2,.9,.4],
    ["Trevor Ariza","崔佛・亞瑞查","SF / SG",8.9,4.3,1.8,1.7,.3],
    ["Lamar Odom","拉瑪・歐登","PF / SF",17.1,9.7,4.1,1.0,1.2],
    ["Robert Horry","羅伯特・歐瑞","PF / SF",12.0,5.8,4.0,1.5,1.0],
    ["Pau Gasol","保羅・蓋索","PF / C",18.9,9.6,3.5,.6,1.0],
    ["Shaquille O'Neal","俠客・歐尼爾","C",29.7,13.6,3.8,.5,3.0],
    ["Andrew Bynum","安德魯・拜南","C",14.3,8.0,1.4,.4,1.8],
  ])},
  {team:"BOS",era:"1980s",label:"波士頓塞爾提克",players:roster("BOS","1980s",[
    ["Dennis Johnson","丹尼斯・強森","PG / SG",17.6,4.0,6.7,1.5,.5],
    ["Danny Ainge","丹尼・安吉","SG / PG",15.7,3.1,6.2,1.4,.2],
    ["Larry Bird","賴瑞・柏德","SF / PF",29.9,9.3,6.1,1.6,.8],
    ["Kevin McHale","凱文・麥克海爾","PF / C",26.1,9.9,2.6,.5,2.2],
    ["Robert Parish","羅伯特・派瑞許","C",19.0,10.7,1.8,.8,1.5],
    ["Cedric Maxwell","塞德里克・麥斯威爾","SF / PF",19.0,9.9,2.9,1.0,.8],
    ["Bill Walton","比爾・華頓","C / PF",7.6,6.8,2.1,.5,1.3],
    ["Gerald Henderson","傑拉德・韓德森","PG / SG",11.6,1.9,3.8,1.5,.1],
    ["Scott Wedman","史考特・魏德曼","SF / SG",9.8,3.2,1.1,.6,.3],
    ["Rick Robey","瑞克・羅比","C / PF",9.0,5.8,1.2,.4,.5],
  ])},
  {team:"SAS",era:"2000s",label:"聖安東尼奧馬刺",players:roster("SAS","2000s",[
    ["Tony Parker","東尼・帕克","PG",22.0,3.1,6.9,.9,.1],
    ["Avery Johnson","艾弗里・強森","PG",13.2,2.5,7.4,1.0,.2],
    ["Manu Ginobili","馬努・吉諾比利","SG / SF",19.5,4.8,4.5,1.5,.4],
    ["Bruce Bowen","布魯斯・包溫","SF / SG",8.2,3.5,1.5,1.0,.4],
    ["Michael Finley","麥可・芬利","SF / SG",22.6,6.3,5.3,1.3,.4],
    ["Robert Horry","羅伯特・歐瑞","PF / SF",12.0,5.8,4.0,1.5,1.0],
    ["Tim Duncan","提姆・鄧肯","PF / C",25.5,12.7,3.7,.7,2.5],
    ["David Robinson","大衛・羅賓森","C",23.2,12.2,2.7,1.4,4.5],
    ["Nazr Mohammed","納茲爾・穆罕默德","C / PF",9.1,7.9,.8,.8,1.0],
    ["Boris Diaw","伯利斯・迪奧","PF / C",13.3,6.9,6.2,.7,1.0],
  ])},
  {team:"GSW",era:"2010s",label:"金州勇士",players:roster("GSW","2010s",[
    ["Stephen Curry","史蒂芬・柯瑞","PG",30.1,5.4,6.7,2.1,.2],
    ["Shaun Livingston","尚恩・李文斯頓","PG / SG",9.3,3.2,3.4,.8,.3],
    ["Klay Thompson","克雷・湯普森","SG / SF",22.3,3.7,2.1,.8,.5],
    ["Andre Iguodala","安德烈・伊古達拉","SF / SG",14.1,6.1,5.5,1.7,.6],
    ["Kevin Durant","凱文・杜蘭特","SF / PF",32.0,7.4,5.5,1.3,.7],
    ["Harrison Barnes","哈里森・巴恩斯","SF / PF",11.7,4.9,1.2,.6,.2],
    ["Draymond Green","德雷蒙・格林","PF / C",14.0,9.5,7.4,1.5,1.4],
    ["David Lee","大衛・李","PF / C",20.1,9.6,2.8,.9,.4],
    ["Andrew Bogut","安德魯・波格特","C",15.9,10.2,3.4,.8,2.5],
    ["JaVale McGee","賈維爾・麥基","C",12.0,8.5,.5,.5,2.4],
  ])},
  {team:"MIA",era:"2010s",label:"邁阿密熱火",players:roster("MIA","2010s",[
    ["Mario Chalmers","馬里歐・查莫斯","PG",10.2,2.9,4.9,1.5,.2],
    ["Goran Dragic","戈蘭・卓吉奇","PG / SG",20.3,3.8,5.9,1.4,.3],
    ["Dwyane Wade","德韋恩・韋德","SG / PG",26.6,4.8,6.5,1.8,1.1],
    ["Ray Allen","雷・艾倫","SG / SF",26.4,4.5,4.1,1.5,.2],
    ["LeBron James","雷霸龍・詹姆斯","SF / PF",27.1,7.9,6.2,1.9,.8],
    ["Shane Battier","尚恩・巴提耶","SF / PF",10.1,4.8,2.1,1.0,1.0],
    ["Chris Bosh","克里斯・波許","PF / C",24.0,10.8,2.4,.6,1.0],
    ["Udonis Haslem","尤杜尼斯・哈斯蘭","PF / C",12.0,9.1,1.4,.8,.4],
    ["Hassan Whiteside","哈桑・懷塞德","C",17.0,14.1,.7,.7,3.7],
    ["Joel Anthony","喬爾・安東尼","C / PF",3.4,3.9,.2,.3,1.3],
  ])},
  {team:"OKC",era:"2010s",label:"奧克拉荷馬雷霆",players:roster("OKC","2010s",[
    ["Russell Westbrook","羅素・衛斯特布魯克","PG",31.6,10.7,10.4,1.6,.4],
    ["Reggie Jackson","瑞吉・傑克森","PG / SG",14.5,4.2,5.2,1.1,.1],
    ["James Harden","詹姆斯・哈登","SG / PG",16.8,4.1,3.7,1.0,.2],
    ["Thabo Sefolosha","薩波・塞佛羅沙","SG / SF",8.5,4.7,2.0,1.7,.4],
    ["Kevin Durant","凱文・杜蘭特","SF / PF",32.0,7.4,5.5,1.3,.7],
    ["Jeff Green","傑夫・格林","SF / PF",16.5,6.7,2.0,1.0,.5],
    ["Serge Ibaka","賽爾吉・伊巴卡","PF / C",15.1,8.8,1.0,.5,3.7],
    ["Nick Collison","尼克・柯里森","PF / C",9.6,9.4,1.4,.6,.8],
    ["Steven Adams","史蒂文・亞當斯","C",13.9,9.5,1.6,1.2,1.0],
    ["Kendrick Perkins","肯德里克・柏金斯","C",10.1,7.6,1.3,.3,1.7],
  ])},
  {team:"PHX",era:"2000s",label:"鳳凰城太陽",players:roster("PHX","2000s",[
    ["Steve Nash","史蒂夫・奈許","PG",18.8,4.2,11.6,.8,.1],
    ["Goran Dragic","戈蘭・卓吉奇","PG / SG",20.3,3.8,5.9,1.4,.3],
    ["Joe Johnson","喬・強森","SG / SF",25.0,4.2,4.4,1.1,.2],
    ["Raja Bell","拉加・貝爾","SG / SF",14.7,3.2,2.6,1.0,.3],
    ["Grant Hill","葛蘭特・希爾","SF / SG",25.8,6.6,5.2,1.4,.6],
    ["Shawn Marion","尚恩・馬里昂","SF / PF",21.8,11.8,2.0,2.0,1.7],
    ["Amar'e Stoudemire","阿瑪雷・史陶德邁爾","PF / C",26.0,8.9,1.6,1.0,1.6],
    ["Boris Diaw","伯利斯・迪奧","PF / C",13.3,6.9,6.2,.7,1.0],
    ["Shaquille O'Neal","俠客・歐尼爾","C",29.7,13.6,3.8,.5,3.0],
    ["Channing Frye","錢寧・弗萊","C / PF",12.7,6.7,1.4,.7,1.0],
  ])},
  {team:"MIL",era:"2020s",label:"密爾瓦基公鹿",players:roster("MIL","2020s",[
    ["Jrue Holiday","朱・哈勒戴","PG / SG",19.3,5.1,7.4,1.6,.4],
    ["Damian Lillard","達米安・里拉德","PG",32.2,4.8,7.3,.9,.3],
    ["Grayson Allen","格雷森・艾倫","SG / SF",11.1,3.3,2.3,.7,.3],
    ["Pat Connaughton","派特・康諾頓","SG / SF",9.9,4.2,1.3,.6,.2],
    ["Khris Middleton","克里斯・米德爾頓","SF / SG",20.9,6.2,4.3,1.1,.1],
    ["Giannis Antetokounmpo","揚尼斯・安戴托昆波","PF / C",31.1,11.8,5.7,.8,.8],
    ["Bobby Portis","鮑比・波提斯","PF / C",14.6,9.6,1.7,.8,.4],
    ["Brook Lopez","布魯克・羅培茲","C",16.4,6.7,1.3,.5,2.5],
    ["Serge Ibaka","賽爾吉・伊巴卡","C / PF",15.1,8.8,1.0,.5,3.7],
    ["P.J. Tucker","P.J.・塔克","PF / SF",7.3,5.8,1.4,1.2,.5],
  ])},
];

export const TEAM_NAMES: Record<string,string> = Object.fromEntries(TEAM_ERAS.map(t => [t.team,t.label]));

