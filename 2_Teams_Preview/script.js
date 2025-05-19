const team1_showdown = `
Koraidon @ Life Orb  
Ability: Orichalcum Pulse  
Level: 50  
Tera Type: Fire  
- Flame Charge  
- Close Combat  
- Flare Blitz  
- Protect  

Lunala @ Power Herb  
Ability: Shadow Shield  
Level: 50  
Tera Type: Grass  
- Moongeist Beam  
- Expanding Force  
- Meteor Beam  
- Wide Guard  

Indeedee-F @ Psychic Seed  
Ability: Psychic Surge  
Level: 50  
Tera Type: Water  
- Psychic  
- Imprison  
- Follow Me  
- Trick Room  

Ursaluna @ Flame Orb  
Ability: Guts  
Level: 50  
Tera Type: Fairy  
- Facade  
- Earthquake  
- Headlong Rush  
- Protect  

Whimsicott @ Covert Cloak  
Ability: Prankster  
Level: 50  
Tera Type: Fire  
- Tailwind  
- Sunny Day  
- Moonblast  
- Encore  

Walking Wake @ Focus Sash  
Ability: Protosynthesis  
Level: 50  
Tera Type: Water  
- Hydro Steam  
- Snarl  
- Flip Turn  
- Draco Meteor  
`;

const team2_showdown = `
Kyogre @ Mystic Water  
Ability: Drizzle  
Level: 50  
Tera Type: Grass  
- Origin Pulse  
- Protect  
- Ice Beam  
- Hydro Pump  

Calyrex-Ice @ Clear Amulet  
Ability: As One (Glastrier)  
Level: 50  
Tera Type: Water  
- Glacial Lance  
- Protect  
- High Horsepower  
- Trick Room  

Grimmsnarl @ Covert Cloak  
Ability: Prankster  
Level: 50  
Tera Type: Steel  
- Foul Play  
- Reflect  
- Light Screen  
- Fake Out  

Indeedee-F @ Psychic Seed  
Ability: Psychic Surge  
Level: 50  
Tera Type: Fire  
- Trick Room  
- Psychic  
- Follow Me  
- Helping Hand  

Okidogi @ Assault Vest  
Ability: Guard Dog  
Level: 50  
Tera Type: Dark  
- Gunk Shot  
- Drain Punch  
- Knock Off  
- Upper Hand  

Ogerpon-Cornerstone (F) @ Cornerstone Mask  
Ability: Sturdy  
Level: 50  
Tera Type: Rock  
- Ivy Cudgel  
- Power Whip  
- Follow Me  
- Spiky Shield   
`;

  function parseShowdown(text) {
    const lines = text.trim().split('\n');
    var team=[];
    var poke=[];

    for (var i = 0; i < lines.length; i++){
      if (lines[i] == ""){
        team.push(poke);
        poke = [];
      } else {
        poke.push(lines[i]);
      }
    }

    if (poke.length != 0){
      team.push(poke);
    }
    console.log(team);

    return team;
  }

  async function getPokemonTypes(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();
    return data.types.map(t => t.type.name); // ['rock', 'flying']
  }

  async function getMoveInfo(moveName) {
  const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName.toLowerCase()}`);
  const data = await response.json();
  return {
    type: data.type.name,
    category: data.damage_class.name
  };
  }

  function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    if (http.status != 404)
        return true;
    else{
        return false;
    }
}


   
  async function fillCard(data) {

    specialPokeDict = {
        "indeedee-f":"indeedee-female",
        "indeedee-m":"indeedee-male",
        "ogerpon-hearthflame-(f)":"ogerpon-hearthflame-mask",
        "ogerpon-cornerstone-(f)":"ogerpon-cornerstone-mask",
        "ogerpon-wellspring-(f)":"ogerpon-wellspring-mask",
        "tornadus":"tornadus-incarnate",
        "thundurus":"thundurus-incarnate",
        "landorus":"landorus-incarnate"
    }

    spriteSpecialDict = {"calyrex-shadow":"calyrex-shadow-rider",
        "calyrex-ice":"calyrex-ice-rider"}

    //Set the card
    var card = document.createElement("div");
    card.className = "pokemon-card";

    //Set the header of the card
    var head = document.createElement("div");
    head.className = "card-header";

    var name = document.createElement("div");
    name.className = "pokemon-name";

    var name_and_item = data[0].split('@');
    var p_name = name_and_item[0].trim();
    var p_item = name_and_item[1].trim();
    const show_name = p_name.replaceAll("-", " ");

    name.innerHTML = `${show_name}`;


    //Tipos y Tera
    var p_name_minus = p_name.toLowerCase().replace(" ","-");
    
    console.log(p_name_minus);
    if (p_name_minus in specialPokeDict){
      console.log(specialPokeDict[p_name_minus]);
      p_name_minus = specialPokeDict[p_name_minus];
    }
    
    console.log("Previo bug tipos");
    console.log(p_name_minus);
    const tipos = await getPokemonTypes(p_name_minus);
    const tera = data[3].replace('Tera Type:', '').trim().toLowerCase();


    var typing = document.createElement("div");
    typing.className = "type-icons";
    var img_t1 = document.createElement("img");
    img_t1.src = `../tipos/${tipos[0]}.png`;

    typing.appendChild(img_t1);

    if (tipos.length > 1){
      var img_t2 = document.createElement("img");
      img_t2.src = `../tipos/${tipos[1]}.png`;
      typing.appendChild(img_t2);
    }

    var img_tera = document.createElement("img");
    img_tera.src = `../tera/${tera}.png`
    img_tera.className = "tera";
    typing.appendChild(img_tera);



    //Appending everything to the card
    head.appendChild(name);
    head.appendChild(typing);
    card.appendChild(head);


    //Card BODY
    var body = document.createElement("div");
    body.className = "card-body";

    //Left section
    var body_left = document.createElement("div");
    body_left.className = "card-left";

    //Ability
    var ability = document.createElement("div");
    ability.className = "ability";
    ability.innerHTML = data[1].replace('Ability:', '').trim();

    body_left.appendChild(ability);

    //Moves
    var moves = document.createElement("ul");
    moves.className = "moves";

    for (var i = 4; i < data.length; i++){
      var move = [];
      var move_name = data[i].replace("-","").trim();

      move.push(move_name);
      move_name = move_name.replaceAll(" ","-");

      const info = await getMoveInfo(move_name);
      
      move.push(info["type"]);

      var move_html = document.createElement("li");
      var move_img = document.createElement("img");
      move_img.className = "move-type";
      move_img.src = `../tipos/${move[1]}.png`;
      const move_txt = document.createTextNode(`${move[0]}`);

      move_html.appendChild(move_img);
      move_html.appendChild(move_txt);
      moves.appendChild(move_html);
    }
    console.log(moves);
    body_left.appendChild(moves);
    

    //Add left side to card
    body.appendChild(body_left);

    


    //Right section
    var body_right = document.createElement("div");
    body_right.className = "card-right";

    //Sprite, Item, Item-name
    var sprite = document.createElement("img");
    sprite.className = "pokemon-sprite";

    console.log("VAMOS A VER EL PUTO NOMBRE");
    console.log(p_name_minus);
    //Para Ogerpawn
    p_name_minus = p_name_minus.replace("-mask","")
    if (p_name_minus in spriteSpecialDict){
      console.log(spriteSpecialDict[p_name_minus]);
      p_name_minus = spriteSpecialDict[p_name_minus];
    }
    sprite.src = `https://img.pokemondb.net/sprites/home/normal/${p_name_minus}.png`

    //Posible rework de items
    const item_Text_name = p_item;
    p_item = p_item.replace(" ","-").toLowerCase();
    console.log(p_item);
    var item_url = `https://raw.githubusercontent.com/msikma/pokesprite/master/items/hold-item/${p_item}.png`;
    if (!UrlExists(item_url)){
      console.log("El nombre anterior: " + p_item + `\nEl nombre que busco ahora: `+p_item);
        item_url=`../items/${p_item}.png`;
    }

    var item_sprite = document.createElement("img");
    item_sprite.className = "item-sprite";
    item_sprite.src = item_url;

    var item_name = document.createElement("div");
    item_name.className = "item-name";
    item_name.innerHTML = `${item_Text_name}`;

    body_right.appendChild(sprite);
    body_right.appendChild(item_sprite);
    body_right.appendChild(item_name);

    body.appendChild(body_right);

    card.appendChild(body);

    return card;

  }

  async function fillTeam(data,team){
    var teams = document.querySelector('.teams-container');
    var this_team = document.createElement("div");
    this_team.classList.add("team");
    this_team.classList.add(`${team}`);
    console.log(teams);
    for (var i = 0; i < data.length; i++){
      let poke = await fillCard(data[i]);
      //console.log(poke)
      this_team.appendChild(poke);
    }
    //console.log(this_team);
    //console.log(teams);
    teams.appendChild(this_team);
  }

  const parsedData1 = parseShowdown(team1_showdown);
  const parsedData2 = parseShowdown(team2_showdown);
  //fillCard(parsedData);

  fillTeam(parsedData1,"team1");
  fillTeam(parsedData2,"team2");