var url = 'http://localhost:3000/'

function Login() {
    var redirect = {
        'admin': "Inicio.html?usuarioLogado=adm"
    };

    if (!document.login_form.txtUsuario.value) {
        alert("Favor colocar o Usuário !");
        document.login_form.txtUsuario.focus();
        return;
    }

    if (!document.login_form.txtSenha.value) {
        alert("Favor colocar a Senha !");
        document.login_form.txtSenha.focus();
        return;
    }

    if (!redirect[document.login_form.txtUsuario.value]) {
        alert('Usurio não cadastrado');
        return;

    }
    window.location.href = redirect[document.login_form.txtUsuario.value];
}
//----------------------------------------------------------Cadastrar usuario--------------------------------------------------------------
function cadastrarUsuario() {

    let body = {
        inputTextNome: document.getElementById('inputTextNome').value,
        inputTextCpf: document.getElementById('inputTextCpf').value
    };

    fetch(url + 'cadastrar', {
        method: 'POST',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    })

        //checa se requisicao deu certo
        .then((response) => {
            if (response.ok) {
                return response.text()
            }
            else {
                return response.text().then((text) => {
                    throw new Error(text)
                })
            }
        })

        //trata resposta
        .then((output) => {
            console.log(output)
            alert('Cadastro efetuado! :D')
        })

        //trata erro
        .catch((error) => {
            console.log(error)
            alert('Não foi possível efetuar o cadastro! :(')
        })
}
//----------------------------------------------------------Cadastrar jogo-----------------------------------------------------------------
function cadastrarJogo() {
    let body = {
        inputTextNomeJogo: document.getElementById('inputTextNomeJogo').value,
        inputTextDescricao: document.getElementById('inputTextDescricao').value,
        //fazer o mesmo para os form-check-input de genero e console
    };

    fetch(url + 'cadastrar-jogo', {
        method: 'POST',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    })

        //checa se requisicao deu certo
        .then((response) => {
            if (response.ok) {
                return response.text()
            }
            else {
                return response.text().then((text) => {
                    throw new Error(text)
                })
            }
        })

        //trata resposta
        .then((output) => {
            console.log(output)
            alert('Cadastro efetuado! :D')
        })

        //trata erro
        .catch((error) => {
            console.log(error)
            alert('Não foi possível efetuar o cadastro! :(')
        })
}
//----------------------------------------------------------listar usuarios----------------------------------------------------------------
function listarUsuarios() {
    fetch(url + 'usuarios')
        .then(response => response.json())
        .then((usuarios) => {

            let tabela = document.getElementById('tabelaUsuarios');
            let linhas = usuarios.map((usuario) => {
                return `<tr>
                    <td>${usuario.nome}</td>
                    <td>${usuario.cpf}</td>
                    <td><button type="button" class="btn btn-danger" onclick="deletarUsuario('${usuario.cpf}')">Deletar</button> 
                    <button type="button" class="btn btn-warning" onclick="atualizar('${usuario.cpf}')">Atualizar</button></td>
                    
                </tr>`
            })

            tabela.innerHTML = linhas.join('');
        }
        )
}
//----------------------------------------------------------listar locacao-----------------------------------------------------------------
function listarLocacao() {
    fetch(url + 'listar-locacoes')
        .then(response => response.json())
        .then((locacoes) => {

            let tabela = document.getElementById('tabelaLocacoes');
            let linhas = locacoes.map((locacao) => {
                return `<tr>
                        <td>${locacao.nome}</td>
                        <td>${locacao.nomeJogo}</td>
                    </tr>`
            })

            tabela.innerHTML = linhas.join('');
        }
        )
}
//----------------------------------------------------------listar jogos-------------------------------------------------------------------
function listarJogos() {
    //da um GET no endpoint "joogos"
    fetch(url + 'jogos')
        .then(response => response.json())
        .then((jogos) => {
            $('#corpoAcordeon').html("")
            $('#corpoAcordeon').append('<div class="accordion" id="accordionExample"></div>')

            for (let jogo of jogos) {
                $('#accordionExample').append('<div class="card"></div>')
                $('.card').append('<div class="card-header" id="heading' + jogo.id + '"></div>')
                $('#heading' + jogo.id).append('<h2 class="mb-0"></h2>')
                $('.mb-0').append('<button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapse' + jogo.id + '" aria-expanded="true" aria-controls="collapse' + jogo.id + '">  ' + jogo.nome + '</button>')
                $('.btn-link').append('<div class="row"></div>')
                $('.row').append('<div class="col-4"></div>')
                $('.row').append('<div class="col-8"></div>')
                $('.col-8').append('<p>' + jogo.descricao + '</p>')
                $('.col-8').append('<p>Genero: ' + jogo.genero + '</p>')
                $('.col-8').append('<p>Console: ' + jogo.console + '</p>')
                $('.col-8').append('<button type="button" class="btn btn-danger mr-3" onclick="deletarJogo(' + jogo.id + ')">Deletar</button> <button type="button" class="btn btn-warning" onclick="atualizar(' + jogo.id + ')">Atualizar</button>')
                $('.col-8').append('<button type="button" class="btn btn-success ml-3" onclick="locarJogo(' + jogo.id + ')">Locar</button>')
            }
            return jogos
        })
}

//deletar jogo
function deletarJogo(id) {
    fetch(url + 'deletar-jogo/' + nome, {
        method: 'DELETE',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })

}
//deletar usuario
function deletarUsuario(id) {
    fetch(url + 'deletar/' + cpf, {
        method: 'DELETE',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })

}

function atualizar(){
    //redireciona para a pagina de atualizacao
    window.location.href = "atualizar.html"
}


//atualizar jogo
function atualizarJogo(id) {

    let body = {
        inputTextNomeJogo: document.getElementById('inputTextNomeJogo').value,
        inputTextDescricao: document.getElementById('inputTextDescricao').value,
        //fazer o mesmo para os form-check-input de genero e console
    }
};
//atualizar usuario
function atualizarUsuario(id) {
    let body = {
        inputTextNome: document.getElementById('inputTextNome').value,
        inputTextCpf: document.getElementById('inputTextCpf').value

    }
};