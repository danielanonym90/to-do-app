class Notes {
  constructor() {
    this._popUp = document.getElementById("pop-up");
    this._close = document.getElementById("close");
    this._blurElement = document.getElementById("blur");
    this._title = document.getElementById("title");
    this._description = document.getElementById("description");
    this._main = document.getElementById("maincontent");
    this._tarefas = {};
  }

  _criarNotaDOM(titulo, descricao, concluido = false) {
    const textBack = document.createElement("h3");
    const descriptionBack = document.createElement("p");
    textBack.classList.add("texto");
    descriptionBack.classList.add("descricao");

    textBack.innerText = titulo;
    descriptionBack.innerText = descricao;

    //Comeca aqui
    // const actionDiv = document.createElement("div");
    // actionDiv.classList.add("actions");

    const newButton = document.createElement("button");
    newButton.classList.add("buttonDelete");
    newButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>`;

    const editButton = document.createElement("button");
    editButton.classList.add("buttonedit");
    const newDiv = document.createElement("div");
    editButton.textContent = "Editar";

    newDiv.classList.add("preview");

    newButton.addEventListener("click", (e) => {
      const card = e.target.closest(".preview");
      if (card) card.remove();
      this.removerTarefa(titulo);
      newDiv.remove();
    });

    let editando = false;
    let inputTitle, inputDesc;

    editButton.addEventListener("click", () => {
      if (!editando) {
        editando = true;
        editButton.textContent = "Salvar";

        inputTitle = document.createElement("input");
        inputTitle.type = "text";
        inputTitle.value = textBack.innerText;
        inputTitle.classList.add("edit-title");

        inputDesc = document.createElement("textarea");
        inputDesc.value = descriptionBack.innerText;
        inputDesc.classList.add("edit-desc");

        div1.replaceChild(inputTitle, textBack);
        div1.replaceChild(inputDesc, descriptionBack);

        // const saveButton = document.createElement("button");
        // saveButton.classList.add("savebutton");
        // saveButton.textContent = "Salvar";
      } else {
        const novotitulo = inputTitle.value.trim();
        const novaDescricao = inputDesc.value.trim();

        if (novotitulo && novaDescricao) {
          if (novotitulo !== titulo) {
            delete this._tarefas[titulo];
          }
          this._tarefas[novotitulo] = {
            descricao: novaDescricao,
            concluido: checkBox.checked,
          };

          this.salvarNoLocalStorage();
          this.renderizarLista();
        }
      }
    });

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.classList.add("checkbox");
    checkBox.checked = concluido;

    // Aplica o estilo ao criar a nota com base no valor vindo do localStorage
    if (concluido) {
      textBack.style.textDecoration = "line-through";
      descriptionBack.style.textDecoration = "line-through";
    } else {
      textBack.style.textDecoration = "none";
      descriptionBack.style.textDecoration = "none";
    }

    checkBox.addEventListener("change", () => {
      const isChecked = checkBox.checked;
      this._tarefas[titulo].concluido = isChecked;
      this.salvarNoLocalStorage();

      // Usa isChecked (estado atual do checkbox), não "concluido"
      if (isChecked) {
        textBack.style.textDecoration = "line-through";
        descriptionBack.style.textDecoration = "line-through";
      } else {
        textBack.style.textDecoration = "none";
        descriptionBack.style.textDecoration = "none";
      }
    });

    const top = document.createElement("div");
    top.classList.add("top");

    top.appendChild(newButton);
    top.appendChild(editButton);
    top.appendChild(checkBox);

    const div1 = document.createElement("div");
    div1.classList.add("div1");
    div1.appendChild(textBack);
    div1.appendChild(descriptionBack);

    newDiv.appendChild(top);
    newDiv.appendChild(div1);
    //newDiv.appendChild(actionDiv);

    this._main.appendChild(newDiv);
  }

  onload() {
    const dadosSalvos = localStorage.getItem("tarefas");
    if (dadosSalvos) {
      this._tarefas = JSON.parse(dadosSalvos);
      this.renderizarLista();
    }
  }
  renderizarLista() {
    this._main.innerHTML = "";
    this._tarefas = Object.fromEntries(
      Object.entries(this._tarefas).filter(([titulo]) => titulo.trim() !== "")
    );
    console.log(this._tarefas);

    for (const [titulo, dados] of Object.entries(this._tarefas)) {
      this._criarNotaDOM(titulo, dados.descricao, dados.concluido);
    }
  }

  adicionarTarefa() {
    const titulo = this._title.value.trim();
    const descricao = this._description.value.trim();

    if (titulo && descricao) {
      this._tarefas[titulo] = {
        descricao: descricao,
        concluido: false,
      };

      this.salvarNoLocalStorage();
      this.renderizarLista();

      document.getElementById("title").value = "";
      document.getElementById("description").value = "";

      this.fecharBtn();
    }
  }
  removerTarefa(titulo) {
    delete this._tarefas[titulo]; // remove do objeto de tarefas
    this.salvarNoLocalStorage(); // atualiza o localStorage
    this.renderizarLista();
  }

  salvarNoLocalStorage() {
    localStorage.setItem("tarefas", JSON.stringify(this._tarefas));
  }

  mostrarBtn() {
    this._popUp.classList.remove("esconder");
    this._blurElement.classList.remove("esconder");
  }

  fecharBtn() {
    this._popUp.classList.add("esconder");
    this._blurElement.classList.add("esconder");
  }
}
const notes = new Notes();

notes.onload();

document.getElementById("create").addEventListener("click", () => {
  notes.mostrarBtn();
});
document.getElementById("createbtn").addEventListener("click", () => {
  notes.adicionarTarefa();
});
document.getElementById("close").addEventListener("click", () => {
  notes.fecharBtn();
});
