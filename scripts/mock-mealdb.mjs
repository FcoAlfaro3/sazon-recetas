// Servidor mock de TheMealDB para desarrollar y probar sin internet.
// Uso: npm run mock  y en .env.local: MEALDB_API_URL=http://localhost:4010/api/json/v1
// Extras: GET /__fail?on=1 simula caídas (500) y /__delay?ms=2000 simula lentitud.
import http from "node:http";
const PORT = 4010;
const HOST = `http://localhost:${PORT}`;
const colores = ["#c0392b","#e67e22","#f1c40f","#27ae60","#16a085","#2980b9","#8e44ad","#d35400","#7f8c8d","#2c3e50","#e84393","#00b894","#6c5ce7","#fdcb6e"];
let fallar = false, demora = 0;
const cats = [
 ["1","Beef","Beef is the culinary name for meat from cattle, particularly skeletal muscle. Humans have been eating beef since prehistoric times."],
 ["2","Chicken","Chicken is a type of domesticated fowl, a subspecies of the red junglefowl. It is one of the most common and widespread domestic animals."],
 ["3","Dessert","Dessert is a course that concludes a meal. The course usually consists of sweet foods, such as confections dishes or fruit."],
 ["4","Lamb","Lamb, hogget, and mutton are the meat of domestic sheep at different ages."],
 ["5","Miscellaneous","General foods that don't fit into another category."],
 ["6","Pasta","Pasta is a staple food of traditional Italian cuisine, with the first reference dating to 1154 in Sicily."],
 ["7","Pork","Pork is the culinary name for meat from a domestic pig. It is the most commonly consumed meat worldwide."],
 ["8","Seafood","Seafood is any form of sea life regarded as food by humans. Prominently fish and shellfish."],
 ["9","Side","A side dish accompanies the entrée or main course at a meal."],
 ["10","Starter","An entrée in modern French table service is a dish served before the main course."],
 ["11","Vegan","Veganism is both the practice of abstaining from the use of animal products, particularly in diet."],
 ["12","Vegetarian","Vegetarianism is the practice of abstaining from the consumption of meat."],
 ["13","Breakfast","Breakfast is the first meal of a day, eaten in the morning."],
 ["14","Goat","The domestic goat is a subspecies of goat domesticated from the wild goat of southwest Asia."],
].map(([id,n,d],i)=>({idCategory:id,strCategory:n,strCategoryThumb:`${HOST}/images/category/${n}.png`,strCategoryDescription:d}));
const meal=(id,name,cat,area,ings,steps,tags="")=>{const m={idMeal:id,strMeal:name,strCategory:cat,strArea:area,strInstructions:steps.map((s,i)=>`STEP ${i+1}\r\n${s}`).join("\r\n\r\n"),strMealThumb:`${HOST}/images/media/meals/${id}.jpg`,strTags:tags||null,strYoutube:"https://www.youtube.com/watch?v=1IszT_guI08",strSource:"https://www.bbcgoodfood.com"};for(let i=1;i<=20;i++){const g=ings[i-1];m[`strIngredient${i}`]=g?g[0]:"";m[`strMeasure${i}`]=g?g[1]:" ";}return m;};
const S=["Bring a large pot of water to a boil. Add kosher salt to the boiling water, then add the pasta.","In a large skillet, heat the olive oil over medium-high heat. Add the garlic and cook until fragrant.","Add the remaining ingredients and simmer for 10 minutes, stirring occasionally.","Taste, adjust the seasoning and serve immediately."];
const meals=[
 meal("52771","Spicy Arrabiata Penne","Vegetarian","Italian",[["penne rigate","1 pound"],["olive oil","1/4 cup"],["garlic","3 cloves"],["chopped tomatoes","1 tin"],["red chilli flakes","1/2 teaspoon"],["italian seasoning","1/2 teaspoon"],["basil","6 leaves"],["Parmigiano-Reggiano","sprinkling"]],S,"Pasta,Curry"),
 meal("52772","Teriyaki Chicken Casserole","Chicken","Japanese",[["soy sauce","3/4 cup"],["water","1/2 cup"],["brown sugar","1/4 cup"],["ground ginger","1/2 teaspoon"],["minced garlic","1/2 teaspoon"],["cornstarch","4 Tablespoons"],["chicken breasts","2"],["stir-fry vegetables","1 (12 oz.)"],["brown rice","3 cups"]],S,"Meat,Casserole"),
 meal("52765","Chicken Enchilada Casserole","Chicken","Mexican",[["Enchilada sauce","14 oz jar"],["shredded Monterey Jack cheese","3 cups"],["corn tortillas","6"],["sour cream","8 ounces"],["chicken","3 cups"]],S),
 meal("52874","Beef and Mustard Pie","Beef","British",[["beef","1kg"],["plain flour","2 tbs"],["rapeseed oil","2 tbs"],["red wine","200ml"],["beef stock","400ml"],["onion","1 finely sliced"],["carrots","2 chopped"],["thyme","3 sprigs"],["mustard","2 tbs"],["puff pastry","400g"]],S,"Meat,Pie"),
 meal("52959","Baked salmon with fennel & tomatoes","Seafood","British",[["fennel","2 medium"],["parsley","2 tbs chopped"],["juice of 1 lemon","1"],["cherry tomatoes","175g"],["olive oil","1 tbs"],["salmon","350g"],["black olives","to serve"]],S,"Paleo,Keto,HighFat"),
 meal("52977","Corba","Side","Turkish",[["lentils","1 cup"],["onion","1 large"],["carrots","1 large"],["tomato puree","1 tbs"],["cumin","2 tsp"],["paprika","1 tsp"],["mint","1/2 tsp"],["butter","2 tbs"]],S,"Soup"),
 meal("53049","Apam balik","Dessert","Malaysian",[["milk","200ml"],["oil","60ml"],["eggs","2"],["flour","1600g"],["baking powder","3 tsp"],["salt","1/2 tsp"],["sugar","45g"],["peanut butter","3 tbs"]],S,"Sweet"),
 meal("52855","Banana Pancakes","Dessert","American",[["banana","1 large"],["eggs","2 medium"],["baking powder","pinch"],["vanilla extract","spinkle"],["oil","1 tsp"],["pecan nuts","25g"],["raspberries","125g"]],S,"Breakfast,Desert,Sweet"),
 meal("52844","Lasagne","Pasta","Italian",[["olive oil","1 tblsp"],["bacon","2"],["onion","1 finely chopped"],["celery","1 stick"],["carrots","1 medium"],["garlic","2 cloves"],["minced beef","500g"],["tomato puree","1 tbls"],["chopped tomatoes","800g"],["lasagne sheets","12"],["creme fraiche","400ml"],["mozzarella","125g"]],S),
 meal("52819","Cajun spiced fish tacos","Seafood","Mexican",[["cajun","2 tsp"],["cayenne pepper","1 tsp"],["white fish","2"],["vegetable oil","1 tsp"],["flour tortilla","4"],["avocado","2"],["little gem lettuce","2"],["spring onion","4"],["salsa","300ml"],["sour cream","4 tbsp"],["lemon","1"],["garlic","1 clove"]],S,"Spicy,Fish"),
 meal("53000","Chicken Fajita Mac and Cheese","Chicken","American",[["macaroni","1/2 lb"],["chicken stock","2 cups"],["heavy cream","1/2 cup"],["fajita seasoning","1 packet"],["salt","1 tsp"],["chicken breast","2"],["olive oil","2 tbsp"],["onion","1 small finely diced"],["red pepper","1"],["garlic","2 cloves"],["cheddar cheese","1 cup"]],S),
 meal("52982","Spaghetti alla Carbonara","Pasta","Italian",[["spaghetti","320g"],["egg yolks","6"],["salt","as required"],["bacon","150g"],["pecorino","50g"],["black pepper","as required"]],S,"Pasta,Meat"),
 meal("52998","Pork Cassoulet","Pork","French",[["pork","1kg"],["butter","50g"],["onion","2"],["carrots","2"],["garlic","4 cloves"],["white beans","2 tins"],["chopped tomatoes","1 tin"],["thyme","3 sprigs"]],S,"Stew"),
 meal("53060","Burek","Side","Croatian",[["filo pastry","1 packet"],["minced beef","150g"],["onion","150g"],["oil","40g"],["salt","dash"],["pepper","dash"]],S,"Streetfood"),
];
const send=(res,code,body,type="application/json")=>{res.writeHead(code,{"Content-Type":type,"Access-Control-Allow-Origin":"*"});res.end(typeof body==="string"?body:JSON.stringify(body));};
http.createServer(async (req,res)=>{
  const u=new URL(req.url,HOST);
  if(u.pathname==="/__fail"){fallar=u.searchParams.get("on")==="1";return send(res,200,{fallar});}
  if(u.pathname==="/__delay"){demora=Number(u.searchParams.get("ms")||0);return send(res,200,{demora});}
  if(u.pathname.startsWith("/images/")){const n=u.pathname.split("/").pop().split(".")[0];const c=colores[[...n].reduce((a,ch)=>a+ch.charCodeAt(0),0)%colores.length];return send(res,200,`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="${c}"/><circle cx="200" cy="200" r="120" fill="#fff" opacity=".25"/><circle cx="160" cy="170" r="40" fill="#fff" opacity=".35"/></svg>`,"image/svg+xml");}
  if(demora) await new Promise(r=>setTimeout(r,demora));
  if(fallar) return send(res,500,"Internal Server Error","text/plain");
  const m=u.pathname.match(/^\/api\/json\/v1\/([^/]+)\/(.+\.php)$/);
  if(!m) return send(res,404,"not found","text/plain");
  const [,key,ep]=m; const p=u.searchParams;
  if(key!=="1") return send(res,401,"bad key","text/plain");
  if(ep==="categories.php") return send(res,200,{categories:cats});
  if(ep==="lookup.php") {const r=meals.filter(x=>x.idMeal===p.get("i"));return send(res,200,{meals:r.length?r:null});}
  if(ep==="search.php") {const s=(p.get("s")||"").toLowerCase();const r=meals.filter(x=>x.strMeal.toLowerCase().includes(s));return send(res,200,{meals:r.length?r:null});}
  if(ep==="filter.php") {const r=meals.filter(x=>x.strCategory===p.get("c")).map(({strMeal,strMealThumb,idMeal})=>({strMeal,strMealThumb,idMeal}));return send(res,200,{meals:r.length?r:null});}
  if(ep==="random.php") return send(res,200,{meals:[meals[Math.floor(Math.random()*meals.length)]]});
  send(res,404,"not found","text/plain");
}).listen(PORT,()=>console.log("mock on",PORT));
