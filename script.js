const showdownText = `
Calyrex-Ice @ Clear Amulet  
Ability: As One (Glastrier)  
Level: 50  
Tera Type: Water  
EVs: 112 HP / 116 Atk / 28 Def / 88 SpD / 164 Spe  
Adamant Nature  
- Glacial Lance  
- Protect  
- Trick Room  
- High Horsepower
`;

function parseShowdown(text) {
    const lines = text.trim().split('\n');
    const result = {
      name: '',
      item: '',
      ability: '',
      teraType: '',
      nature: '',
      evs: { HP: 0, Atk: 0, Def: 0, SpA: 0, SpD: 0, Spe: 0 },
      ivs: { HP: 31, Atk: 31, Def: 31, SpA: 31, SpD: 31, Spe: 31 },
      types: '',
      moves: []      
    };

    const firstLine = lines[0].match(/^(.*?) @ (.*)$/);
    if (firstLine) {
      result.name = firstLine[1].trim();
      result.item = firstLine[2].trim();
    }

    for (const line of lines.slice(1)) {
      if (line.startsWith('Ability:')) {
        result.ability = line.replace('Ability:', '').trim();
      } else if (line.startsWith('Tera Type:')) {
        result.teraType = line.replace('Tera Type:', '').trim();
      } else if (line.includes('Nature')) {
        result.nature = line.replace('Nature', '').trim();
      } else if (line.includes('Typing: ')) {
        result.types = line.replace('Typing: ', '').trim();
      } else if (line.startsWith('EVs:')) {
        const parts = line.replace('EVs:', '').split('/');
        for (const part of parts) {
          const [value, stat] = part.trim().split(' ');
          result.evs[stat] = parseInt(value);
        }
      } else if (line.startsWith('IVs:')) {
        const parts = line.replace('IVs:', '').split('/');
        for (const part of parts) {
          const [value, stat] = part.trim().split(' ');
          result.ivs[stat] = parseInt(value);
        }
      } else if (line.startsWith('-')) {
        result.moves.push(line.replace('-', '').trim());
      }
    }

    return result;
  }
    async function getPokemonTypes(pokemonName) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
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


//Async added para el type and move type
  async function fillCard(data) {
    specialPokeDict = {"calyrex-shadow":"calyrex-shadow-rider",
        "calyrex-ice":"calyrex-ice-rider",
        "indeedee-f":"indeedee-female",
        "indeedee-m":"indeedee-male",
        "ogerpon-hearthflame":"ogerpon-hearthflame-mask",
        "ogerpon-cornerstone":"ogerpon-cornerstone-mask",
        "ogerpon-wellspring":"ogerpon-wellspring-mask",
        "tornadus":"tornadus-incarnate",
        "thundurus":"thundurus-incarnate",
        "landorus":"landorus-incarnate"
    }
    
    //Name + Sprite
    document.querySelector('.pokemon-name').textContent = data.name.replaceAll("-"," ");
    let p_name = data.name.split("(");
    p_name = p_name[0].trim().replaceAll(" ", "-");
    p_name = p_name.toLowerCase(); 
    old_p_name = p_name
    if (p_name in specialPokeDict){
        old_p_name = p_name;
        p_name = specialPokeDict[p_name];
    }

    console.log(p_name);
    console.log(old_p_name);
    if (p_name.search("ogerpon") != -1){
        document.querySelector('.sprite').src = `https://img.pokemondb.net/sprites/home/normal/${old_p_name}.png`;
    } else {
        document.querySelector('.sprite').src = `https://img.pokemondb.net/sprites/home/normal/${p_name}.png`;
    }

    //Typing and Tera
    var tera = data.teraType.toLowerCase();
    document.querySelector('.tera-icon').src = `./tera/${tera}.png`

    if (p_name.search("calyrex") != -1){
      console.log("what");
        var p_types = await getPokemonTypes(old_p_name.toLowerCase());
        
    } else {
      console.log("Quiero morir");
        var p_types = await getPokemonTypes(p_name.toLowerCase());
    }
    console.log(p_types);
    
    const t1 = p_types[0];
    let t2="";
    if(p_types.length > 1){
      t2 = p_types[1];
    } else {
      t2 = p_types[0];
    }

    console.log(t1+" "+t2);
    
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    const t_color_1 = rs.getPropertyValue(`--${t1}`).trim();
    const t_color_2 = rs.getPropertyValue(`--${t2}`).trim();
    r.style.setProperty('--tipo-p-2',t_color_1);
    r.style.setProperty('--tipo-p-1',t_color_2);


    //Moves
    // Suponiendo que tienes los datos en un archivo JSON local moves.json
    

    const moveEls = document.querySelectorAll('.move');
    for (let i = 0; i < moveEls.length; i++) {
      const moveNameType = data.moves[i] || '';
      /*let allMove = moveNameType.split('-');
      const moveName = allMove[0];
      const moveType = allMove[1];
      const moveCat= allMove[2];*/
      const moveEl = moveEls[i];

      console.log(moveNameType);
      var real_name = moveNameType.replace("]","");
      real_name = real_name.split('[');
      console.log(real_name);
      var move_papi = await getMoveInfo(real_name[0].replace(" ", "-"));
      console.log(move_papi);

      if (real_name.length > 1){
        move_papi.type = real_name[1].toLowerCase().trim()
      }

        //Imagen del tipo del movimiento
      var T_img = document.createElement("img");
      T_img.src = `./tipos/${move_papi.type}.png`;

      //Imagen de la categoria del movimiento
      var C_img = document.createElement("img");
      C_img.src = `./categorias/${move_papi.category}.png`;


      moveEl.appendChild(T_img);
      moveEl.appendChild(C_img);
      moveEl.appendChild(document.createTextNode(' ' + real_name[0]));
      moveEl.classList.add(move_papi.type, move_papi.category);
    }


    //Item
    var item_name = data.item.trim();
    item_name = item_name.replace(" ", "-").toLowerCase();

    //Posible rework de items
    console.log(item_name);
    var item_url = `https://raw.githubusercontent.com/msikma/pokesprite/master/items/hold-item/${item_name}.png`;
    if (!UrlExists(item_url)){
        item_url=`./items/${item_name}.png`
    }

    //Ability
    var ability_text = data.ability.split('(');
    ability_text=ability_text[0].trim();

    const rightBox = document.querySelector('.right-box');
    rightBox.children[0].innerHTML = `${ability_text} <img src="https://images2.wikidexcdn.net/mwuploads/wikidex/3/3a/latest/20230102183819/C%C3%A1psula_habilidad_EP.png" alt="Ability Icon">`;
    rightBox.children[1].innerHTML = `${data.item} <img src="${item_url}" alt="Item Icon">`;
    rightBox.children[2].innerHTML = `${data.nature} <img src="https://images2.wikidexcdn.net/mwuploads/wikidex/thumb/a/ae/latest/20230102193234/Menta_roja_EP.png/120px-Menta_roja_EP.png" alt="Nature Icon">`;


    //Stats
    nature_dictionary={ 
     "Adamant":["Atk","SpA"], 
     "Bold":["Def","Atk"],
     "Brave":["Atk","Spe"],
     "Calm":["SpD","Atk"],
     "Careful":["SpD","SpA"],
     "Gentle":["SpD","Def"],
     "Hasty":["Spe","Def"],
     "Impish":["Def","SpA"],
     "Jolly":["Spe","SpA"],
     "Lax":["Def","SpD"],
     "Lonely":["Atk","Def"],
     "Mild":["SpA","Def"],
     "Modest":["SpA","Atk"],
     "Naive":["Spe","SpD"],
     "Naughty":["Atk","SpD"],
     "Quiet":["SpA","Spe"],
     "Rash":["SpA","SpD"],
     "Relaxed":["Def","Spe"],
     "Sassy":["SpD","Spe"], 
     "Timid":["Spe", "Atk"]
    }
    console.log(nature_dictionary)
    const statEls = document.querySelector('.card-bottom');

   var statlist = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
   let nature = nature_dictionary[data.nature]
   console.log(nature);
  statlist.forEach((stat, i) => {
      var statistic = document.createElement("div");
      statistic.classList.add("stat");

      if (nature[0] === stat) {
        statistic.classList.add("buff");
      } else if (nature[1] === stat) {
        statistic.classList.add("nerf");
      }

      // Añadir nombre del stat
      statistic.textContent = stat;

      // Crear y añadir br + EV
      statistic.appendChild(document.createElement("br"));
      var ev = document.createElement("span");
      ev.classList.add("ev-value");
      ev.textContent = data.evs[stat] ?? 0;
      statistic.appendChild(ev);

      // Crear y añadir br + IV
      statistic.appendChild(document.createElement("br"));
      var iv = document.createElement("span");
      iv.classList.add("iv-value");
      iv.textContent = data.ivs[stat] ?? 31; // ¡Ojo! Aquí estabas mostrando `evs` de nuevo
      statistic.appendChild(iv);

      // Agregar al contenedor final
      statEls.appendChild(statistic);
  });
   
  }

  const parsedData = parseShowdown(showdownText);
  fillCard(parsedData);