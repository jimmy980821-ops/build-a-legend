export type Decade = "1960s" | "1970s" | "1980s" | "1990s" | "2000s" | "2010s" | "2020s";
export type PerfectPlayer = { name:string; cname:string; team:string; decade:Decade; pos:string; pts:number; reb:number; ast:number; stl:number; blk:number };

export const DECADES: Decade[] = ["1960s","1970s","1980s","1990s","2000s","2010s","2020s"];

export const PERFECT_PLAYERS: PerfectPlayer[] = [
  {name:"Wilt Chamberlain",cname:"威爾特・張伯倫",team:"PHI",decade:"1960s",pos:"C",pts:50.4,reb:25.7,ast:2.4,stl:0,blk:8.8},
  {name:"Bill Russell",cname:"比爾・羅素",team:"BOS",decade:"1960s",pos:"C",pts:18.9,reb:23.6,ast:4.5,stl:0,blk:7.0},
  {name:"Oscar Robertson",cname:"奧斯卡・羅伯森",team:"SAC",decade:"1960s",pos:"PG",pts:31.4,reb:9.9,ast:11.4,stl:0,blk:0},
  {name:"Jerry West",cname:"傑瑞・衛斯特",team:"LAL",decade:"1960s",pos:"SG",pts:31.3,reb:7.9,ast:6.1,stl:0,blk:0},
  {name:"Elgin Baylor",cname:"艾爾金・貝勒",team:"LAL",decade:"1960s",pos:"SF",pts:38.3,reb:18.6,ast:4.6,stl:0,blk:0},
  {name:"Bob Pettit",cname:"鮑勃・佩提特",team:"ATL",decade:"1960s",pos:"PF",pts:31.1,reb:18.7,ast:3.7,stl:0,blk:0},
  {name:"Hal Greer",cname:"哈爾・格里爾",team:"PHI",decade:"1960s",pos:"SG",pts:24.1,reb:5.4,ast:4.5,stl:0,blk:0},
  {name:"Sam Jones",cname:"山姆・瓊斯",team:"BOS",decade:"1960s",pos:"SG",pts:25.9,reb:5.1,ast:2.5,stl:0,blk:0},

  {name:"Kareem Abdul-Jabbar",cname:"卡里姆・阿布杜爾-賈霸",team:"MIL",decade:"1970s",pos:"C",pts:34.8,reb:16.6,ast:4.6,stl:1.2,blk:3.5},
  {name:"Julius Erving",cname:"朱利爾斯・厄文",team:"PHI",decade:"1970s",pos:"SF",pts:27.3,reb:8.7,ast:4.6,stl:2.3,blk:1.2},
  {name:"Bill Walton",cname:"比爾・華頓",team:"POR",decade:"1970s",pos:"C",pts:18.9,reb:13.2,ast:5.0,stl:1.0,blk:2.5},
  {name:"John Havlicek",cname:"約翰・哈夫利切克",team:"BOS",decade:"1970s",pos:"SF",pts:28.9,reb:9.0,ast:7.5,stl:1.3,blk:.4},
  {name:"Elvin Hayes",cname:"艾爾文・海耶斯",team:"WAS",decade:"1970s",pos:"PF",pts:28.7,reb:16.6,ast:2.0,stl:.9,blk:3.0},
  {name:"Walt Frazier",cname:"華特・弗雷澤",team:"NYK",decade:"1970s",pos:"PG",pts:23.2,reb:6.7,ast:6.7,stl:2.0,blk:.2},
  {name:"Rick Barry",cname:"瑞克・貝瑞",team:"GSW",decade:"1970s",pos:"SF",pts:30.6,reb:5.7,ast:6.2,stl:2.9,blk:.5},
  {name:"George Gervin",cname:"喬治・葛文",team:"SAS",decade:"1970s",pos:"SG",pts:33.1,reb:5.2,ast:2.6,stl:1.4,blk:1.0},

  {name:"Magic Johnson",cname:"魔術・強森",team:"LAL",decade:"1980s",pos:"PG",pts:23.9,reb:6.3,ast:12.2,stl:1.7,blk:.5},
  {name:"Larry Bird",cname:"賴瑞・柏德",team:"BOS",decade:"1980s",pos:"SF",pts:29.9,reb:9.3,ast:6.1,stl:1.6,blk:.8},
  {name:"Moses Malone",cname:"摩西・馬龍",team:"PHI",decade:"1980s",pos:"C",pts:31.1,reb:14.7,ast:1.8,stl:.9,blk:1.5},
  {name:"Isiah Thomas",cname:"以賽亞・湯瑪斯",team:"DET",decade:"1980s",pos:"PG",pts:22.9,reb:4.5,ast:13.9,stl:2.3,blk:.3},
  {name:"Michael Jordan",cname:"麥可・喬丹",team:"CHI",decade:"1980s",pos:"SG",pts:37.1,reb:5.2,ast:4.6,stl:2.9,blk:1.5},
  {name:"Hakeem Olajuwon",cname:"哈基姆・歐拉朱萬",team:"HOU",decade:"1980s",pos:"C",pts:24.8,reb:14.0,ast:2.9,stl:2.6,blk:3.4},
  {name:"Dominique Wilkins",cname:"多明尼克・威金斯",team:"ATL",decade:"1980s",pos:"SF",pts:30.7,reb:6.4,ast:2.9,stl:1.3,blk:.6},
  {name:"Alex English",cname:"艾力克斯・英格利許",team:"DEN",decade:"1980s",pos:"SF",pts:28.4,reb:7.3,ast:4.8,stl:1.4,blk:1.2},

  {name:"Michael Jordan",cname:"麥可・喬丹",team:"CHI",decade:"1990s",pos:"SG",pts:32.6,reb:6.7,ast:5.5,stl:2.8,blk:1.0},
  {name:"Hakeem Olajuwon",cname:"哈基姆・歐拉朱萬",team:"HOU",decade:"1990s",pos:"C",pts:27.8,reb:10.8,ast:3.5,stl:1.8,blk:3.4},
  {name:"Karl Malone",cname:"卡爾・馬龍",team:"UTA",decade:"1990s",pos:"PF",pts:31.0,reb:11.1,ast:2.8,stl:1.5,blk:.6},
  {name:"John Stockton",cname:"約翰・史塔克頓",team:"UTA",decade:"1990s",pos:"PG",pts:17.2,reb:2.6,ast:14.5,stl:2.7,blk:.2},
  {name:"David Robinson",cname:"大衛・羅賓森",team:"SAS",decade:"1990s",pos:"C",pts:29.8,reb:10.7,ast:4.8,stl:1.7,blk:3.3},
  {name:"Charles Barkley",cname:"查爾斯・巴克利",team:"PHX",decade:"1990s",pos:"PF",pts:25.6,reb:12.2,ast:5.1,stl:1.6,blk:1.0},
  {name:"Scottie Pippen",cname:"史考提・皮朋",team:"CHI",decade:"1990s",pos:"SF",pts:22.0,reb:8.7,ast:5.6,stl:2.9,blk:.8},
  {name:"Shaquille O'Neal",cname:"俠客・歐尼爾",team:"ORL",decade:"1990s",pos:"C",pts:29.3,reb:13.2,ast:2.4,stl:.9,blk:2.9},

  {name:"Kobe Bryant",cname:"柯比・布萊恩",team:"LAL",decade:"2000s",pos:"SG",pts:35.4,reb:5.3,ast:4.5,stl:1.8,blk:.4},
  {name:"Tim Duncan",cname:"提姆・鄧肯",team:"SAS",decade:"2000s",pos:"PF",pts:25.5,reb:12.7,ast:3.7,stl:.7,blk:2.5},
  {name:"Kevin Garnett",cname:"凱文・賈奈特",team:"MIN",decade:"2000s",pos:"PF",pts:24.2,reb:13.9,ast:5.0,stl:1.5,blk:2.2},
  {name:"LeBron James",cname:"雷霸龍・詹姆斯",team:"CLE",decade:"2000s",pos:"SF",pts:31.4,reb:7.0,ast:6.6,stl:1.6,blk:.8},
  {name:"Dirk Nowitzki",cname:"德克・諾威斯基",team:"DAL",decade:"2000s",pos:"PF",pts:26.6,reb:9.0,ast:2.8,stl:.7,blk:1.0},
  {name:"Dwyane Wade",cname:"德韋恩・韋德",team:"MIA",decade:"2000s",pos:"SG",pts:30.2,reb:5.0,ast:7.5,stl:2.2,blk:1.3},
  {name:"Steve Nash",cname:"史蒂夫・奈許",team:"PHX",decade:"2000s",pos:"PG",pts:18.8,reb:4.2,ast:11.6,stl:.8,blk:.1},
  {name:"Allen Iverson",cname:"艾倫・艾佛森",team:"PHI",decade:"2000s",pos:"SG",pts:33.0,reb:3.2,ast:7.4,stl:1.9,blk:.1},

  {name:"Stephen Curry",cname:"史蒂芬・柯瑞",team:"GSW",decade:"2010s",pos:"PG",pts:30.1,reb:5.4,ast:6.7,stl:2.1,blk:.2},
  {name:"LeBron James",cname:"雷霸龍・詹姆斯",team:"MIA",decade:"2010s",pos:"SF",pts:27.1,reb:7.9,ast:6.2,stl:1.9,blk:.8},
  {name:"Kevin Durant",cname:"凱文・杜蘭特",team:"OKC",decade:"2010s",pos:"SF",pts:32.0,reb:7.4,ast:5.5,stl:1.3,blk:.7},
  {name:"James Harden",cname:"詹姆斯・哈登",team:"HOU",decade:"2010s",pos:"SG",pts:36.1,reb:6.6,ast:7.5,stl:2.0,blk:.7},
  {name:"Russell Westbrook",cname:"羅素・衛斯特布魯克",team:"OKC",decade:"2010s",pos:"PG",pts:31.6,reb:10.7,ast:10.4,stl:1.6,blk:.4},
  {name:"Kawhi Leonard",cname:"科懷・雷納德",team:"TOR",decade:"2010s",pos:"SF",pts:26.6,reb:7.3,ast:3.3,stl:1.8,blk:.4},
  {name:"Chris Paul",cname:"克里斯・保羅",team:"LAC",decade:"2010s",pos:"PG",pts:22.8,reb:4.0,ast:11.0,stl:2.5,blk:.1},
  {name:"Anthony Davis",cname:"安東尼・戴維斯",team:"NOP",decade:"2010s",pos:"PF",pts:28.1,reb:11.1,ast:2.3,stl:1.5,blk:2.6},

  {name:"Nikola Jokic",cname:"尼古拉・約基奇",team:"DEN",decade:"2020s",pos:"C",pts:29.6,reb:12.7,ast:10.2,stl:1.8,blk:.6},
  {name:"Giannis Antetokounmpo",cname:"揚尼斯・安戴托昆波",team:"MIL",decade:"2020s",pos:"PF",pts:31.1,reb:11.8,ast:5.7,stl:.8,blk:.8},
  {name:"Shai Gilgeous-Alexander",cname:"謝伊・吉爾傑斯-亞歷山大",team:"OKC",decade:"2020s",pos:"PG",pts:32.7,reb:5.0,ast:6.4,stl:1.7,blk:1.0},
  {name:"Luka Doncic",cname:"盧卡・東契奇",team:"DAL",decade:"2020s",pos:"PG",pts:33.9,reb:9.2,ast:9.8,stl:1.4,blk:.5},
  {name:"Joel Embiid",cname:"喬爾・恩比德",team:"PHI",decade:"2020s",pos:"C",pts:34.7,reb:11.0,ast:5.6,stl:1.2,blk:1.7},
  {name:"Jayson Tatum",cname:"傑森・塔圖姆",team:"BOS",decade:"2020s",pos:"SF",pts:30.1,reb:8.8,ast:4.6,stl:1.1,blk:.7},
  {name:"Victor Wembanyama",cname:"維克托・文班亞馬",team:"SAS",decade:"2020s",pos:"C",pts:24.3,reb:11.0,ast:3.7,stl:1.1,blk:3.8},
  {name:"Devin Booker",cname:"德文・布克",team:"PHX",decade:"2020s",pos:"SG",pts:27.8,reb:4.5,ast:6.9,stl:.9,blk:.4},
];
