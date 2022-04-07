const BASE_URL = 'http://localhost:8080';

//Função responsável por fazer as chamadas para a API
const fetchApi = async (url, metodo, body) => {
  const response = await fetch(`${BASE_URL}/${url}`, {
    method: metodo,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    return await response.json();
  }

  alert('Ocorreu um erro!');
};

//Função executada no evento de load da página
const load = () => {
  carregaProdutos();
  carregaSelect();
};

//Função executada no evento de click do item da list
const carregaDetalhesProduto = async (id) => {
  //Busca da api o produto
  const data = await fetchApi(`produtos/${id}`, 'GET');
  if (data) {
    //Obtem a div de detalhes
    const detalhes = document.getElementById('detalhes');
    //Limpa os elementos da div de detalhes
    detalhes.innerHTML = '';

    //Cria a tabela para exibir os detalhes
    const table = document.createElement('table');

    //Cria o cabeçalho da tabela
    const tableHead = document.createElement('tr');
    tableHead.appendChild(criaTableRows('th', 'Nome'));
    tableHead.appendChild(criaTableRows('th', 'Descrição'));
    tableHead.appendChild(criaTableRows('th', 'Preço'));
    tableHead.appendChild(criaTableRows('th', 'Categoria'));
    table.appendChild(tableHead);

    //Cria o corpo da tabela
    const tableBody = document.createElement('tr');
    tableBody.appendChild(criaTableRows('td', data.nome));
    tableBody.appendChild(criaTableRows('td', data.descricao));
    tableBody.appendChild(criaTableRows('td', data.preco));
    tableBody.appendChild(criaTableRows('td', data.categoria_id));
    table.appendChild(tableBody);

    //Adiciona a tabela na div de detalhes
    detalhes.appendChild(table);
  }
};

//Função responsável por popular o select com as categorias
const carregaSelect = async () => {
  //Busca as categorias da api
  const data = await fetchApi('categorias', 'GET');

  //Busca o select do html
  const select = document.getElementById('categoria');

  data.forEach((categoria) => {
    //Cria as options e adiciona no select
    const option = document.createElement('option');
    option.value = categoria.id;
    option.innerText = categoria.nome;
    select.appendChild(option);
  });
};

//Função responsável por carregar a lista de produtos da API
const carregaProdutos = async () => {
  //Busca os produtos da API
  const data = await fetchApi('produtos', 'GET');

  if (data) {
    //Busca a ul para adicionar os itens
    const lista = document.getElementById('lista');

    data.forEach((produto) => {
      //Chama a função para adicionar os itens na lista
      adicionaProdutoNaLista(lista, produto);
    });
  }
};

//Função responsável por criar as linhas da tabela
const criaTableRows = (element, text) => {
  const el = document.createElement(element);
  el.innerText = text;
  return el;
};

//Função responsável por validar se o valor informado no campo é valido
const validaValor = (element) => {
  //Valida se não for válido exibe alerta
  if (!element.value) {
    alert(`O campo ${element.getAttribute('name')} é obrigatório!`);
    return false;
  }

  return true;
};

//Função responsável por adicionar um produto na API
const adicionarProduto = async () => {
  //Obtem os campos do formulário html
  const nome = document.getElementById('nome');
  const descricao = document.getElementById('descricao');
  const preco = document.getElementById('preco');
  const categoria = document.getElementById('categoria');

  //Valida se os campos obrigatórios foram informados
  if (validaValor(nome) && validaValor(descricao) && validaValor(preco) && validaValor(categoria)) {
    const produto = {
      nome: nome.value,
      descricao: descricao.value,
      preco: preco.value,
      categoria_id: categoria.value,
    };

    //Faz a chamada para adicionar o produto através da API
    const data = await fetchApi('produtos', 'POST', produto);

    //Adiciona produto na lista html
    const lista = document.getElementById('lista');
    adicionaProdutoNaLista(lista, data);

    //Limpa formulário
    nome.value = '';
    descricao.value = '';
    preco.value = '';
  }
};

//Função responsável por excluir um produto da API
const excluirProduto = async (id) => {
  //Deleta o produto da API
  await fetchApi(`produtos/${id}`, 'DELETE');

  //Encontra o elemento e remove do html
  const element = document.getElementById(id);
  element.remove();
};

//Função responsável por adicionar o produto na lista html
const adicionaProdutoNaLista = (lista, produto) => {
  const item = document.createElement('li');
  item.className = 'item-lista';
  item.id = produto.id;

  const title = document.createElement('span');
  title.innerText = produto.nome;
  title.id = `title-${produto.id}`;
  title.className = 'item-lista-title';
  title.onclick = () => carregaDetalhesProduto(produto.id);
  title.title = 'Ver detalhes';
  item.appendChild(title);

  const editar = document.createElement('button');
  editar.innerText = 'Editar';
  editar.className = 'button-editar';
  editar.onclick = () => editarProduto(produto.id);
  item.appendChild(editar);

  const excluir = document.createElement('button');
  excluir.innerText = 'Excluir';
  excluir.className = 'button-excluir';
  excluir.onclick = () => excluirProduto(produto.id);
  item.appendChild(excluir);

  lista.appendChild(item);
};

//Função responsável por popular os campos no formulário para edição
const editarProduto = async (id) => {
  //Busca da api o produto
  const data = await fetchApi(`produtos/${id}`, 'GET');
  if (data) {
    //Obtem os campos do formulário html
    const id = document.getElementById('id');
    const nome = document.getElementById('nome');
    const descricao = document.getElementById('descricao');
    const preco = document.getElementById('preco');
    const categoria = document.getElementById('categoria');
    console.log(data, data.categoria_id);
    //Popula os campos
    id.value = data.id;
    nome.value = data.nome;
    descricao.value = data.descricao;
    preco.value = data.preco;
    categoria.value = data.categoria_id;
  }
};

//Função responsável por atualizar um produto na API
const atualizarProduto = async () => {
  //Obtem os campos do formulário html
  const id = document.getElementById('id');
  const nome = document.getElementById('nome');
  const descricao = document.getElementById('descricao');
  const preco = document.getElementById('preco');
  const categoria = document.getElementById('categoria');

  //Valida se os campos obrigatórios foram informados
  if (validaValor(id) && validaValor(nome) && validaValor(descricao) && validaValor(preco) && validaValor(categoria)) {
    const produto = {
      id: id.value,
      nome: nome.value,
      descricao: descricao.value,
      preco: preco.value,
      categoria_id: categoria.value,
    };

    //Faz a chamada para atualizar o produto através da API
    const data = await fetchApi(`produtos/${id.value}`, 'PUT', produto);

    //Atualiza o nome do produto na lista html
    const item = document.getElementById(`title-${id.value}`);
    item.innerText = data.nome;

    //Limpa formulário
    id.value = '';
    nome.value = '';
    descricao.value = '';
    preco.value = '';
  }
};

//Função chamada no submit do form
const submitForm = () => {
  const id = document.getElementById('id');
  //valida se tiver id atualiza se não cria
  id.value ? atualizarProduto() : adicionarProduto();
};
