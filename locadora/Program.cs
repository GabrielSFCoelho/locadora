using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace locadora
{
    public enum TipoGenero { Acao, Aventura, Casual, Puzze, Estrategia, Outro }
    public enum TipoConsole { PS4, PS5, Switch, Xbox_360, Xbox_One, PC, Outro }
    //classe do jogo
    public class Jogo
    {
        public Jogo()
        {
            this.Id =1;
            this.Nome = "";
            this.Descricao = "";
            this.Genero = TipoGenero.Outro;
            this.Console = TipoConsole.Outro;
        }

        public Jogo(int id, String nome, String descricao, TipoGenero genero, TipoConsole console)
        {
            this.Id = id;
            this.Nome = nome;
            this.Descricao = descricao;
            this.Genero = genero;
            this.Console = console;
        }

        private int id;

        public int Id
        {
            get { return id; }
            set
            {
                if (value > 0) id = value;
                else
                {
                    throw new Exception("Permitido apenas numeros positivos!!!!");
                }
            }
        }

        private String nome;

        public String Nome
        {
            get { return nome; }
            set { nome = value.ToUpper(); }
        }

        private String descricao;

        public String Descricao
        {
            get { return descricao; }
            set { descricao = value.ToUpper(); }
        }

        public TipoConsole Console { get; set; }
        public TipoGenero Genero { get; set; }   
    }
    
    class Usuario
    {
        public int id { get; set; }
        public string? nome { get; set; }
        public string? cpf { get; set; }
    }

    class locacaoJogo
    {
       public int id{ get; set; }       
       public int idJogo{ get; set; }    
       public Usuario? usuario {get; set;}       
       public int idUsuario{ get; set; } 

    }

    class Body{
        public int[]? idJogos {get; set;}
        public int idUsuario {get; set;}
    }

    class BaseUsuarios : DbContext
    {
        public BaseUsuarios(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; } = null!;
        public DbSet<Jogo> Jogo {get; set;} = null!;        
        public DbSet<locacaoJogo> locacaoJogos {get; set;} = null!;
    }
    

    //programa principal    
    class Program
    {        
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("Usuarios") ?? "Data Source=Usuarios.db";
            builder.Services.AddSqlite<BaseUsuarios>(connectionString);

            var app = builder.Build();

            //listar todos os usuarios
            app.MapGet("/usuarios", (BaseUsuarios baseUsuarios) =>
            {
                return baseUsuarios.Usuarios.ToList();
            });

            //listar todos os jogos
             app.MapGet("/jogos", (BaseUsuarios baseUsuarios) =>
            {
                return baseUsuarios.Jogo.ToList();
            });

            //listar usuario especifico (por CPF)
            app.MapGet("/usuario/{cpf}", (BaseUsuarios baseUsuarios, string cpf) =>
            {
                return baseUsuarios.Usuarios.Where(x => x.cpf == cpf).FirstOrDefault();
            });

            //cadastrar usuario
            app.MapPost("/cadastrar", (BaseUsuarios baseUsuarios, Usuario usuario) =>
            {
                baseUsuarios.Usuarios.Add(usuario);
                baseUsuarios.SaveChanges();
                return "usuario adicionado";
            });

            //cadastrar jogos
            app.MapPost("/cadastrar-jogo", (BaseUsuarios baseUsuarios, Jogo jogo) =>
            {
                baseUsuarios.Jogo.Add(jogo);
                baseUsuarios.SaveChanges();
                return "Jogo adicionado";
            });

            //atualizar usuario
            app.MapPost("/atualizar/{cpf}", (BaseUsuarios baseUsuarios, Usuario usuarioAtualizado, string cpf) =>
            {
                var usuario = baseUsuarios.Usuarios.Where(x => x.cpf == cpf).FirstOrDefault();
                usuario.nome = usuarioAtualizado.nome;
                usuario.cpf = usuarioAtualizado.cpf;
                baseUsuarios.SaveChanges();
                return "Usuario atualizado";
            });

            //atualizar jogos
             app.MapPost("/atualizar-jogo/{nome}", (BaseUsuarios baseUsuarios, Jogo jogoAtualizado, string nome) =>
            {
                var game = baseUsuarios.Jogo.Where(x => x.Nome == nome).FirstOrDefault();
                game.Nome = jogoAtualizado.Nome;
                game.Descricao = jogoAtualizado.Descricao;
                game.Genero = jogoAtualizado.Genero;
                game.Console = jogoAtualizado.Console;
                baseUsuarios.SaveChanges();
                return "Jogo atualizado";
            });

            //deletar usuario
            app.MapPost("/deletar/{cpf}", (BaseUsuarios baseUsuarios, string cpf) =>
            {
                var usuario = baseUsuarios.Usuarios.Where(x => x.cpf == cpf).FirstOrDefault();
                baseUsuarios.Remove(usuario);
                baseUsuarios.SaveChanges();
                return "Usiario excluido";
            });

            //deletar jogo
            app.MapPost("/deletar-jogo/{nome}", (BaseUsuarios baseUsuarios, string nome) =>
            {
                var game = baseUsuarios.Jogo.Where(x => x.Nome == nome).FirstOrDefault();
                baseUsuarios.Remove(game);
                baseUsuarios.SaveChanges();
                return "Jogo excluido";
            });
            //Criando locação
            app.MapPost("/alugarjogo", (BaseUsuarios baseUsuarios, Body corpo) =>
            {
                var locacao = new locacaoJogo();
                // locacao.idUsuario = corpo.idUsuario;
                // locacao.idJogo = corpo.idJogos[0];
                // baseUsuarios.locacaoJogos.Add(locacao);
                // baseUsuarios.SaveChanges();
                foreach (var item in corpo.idJogos)
                 {

                    var novaLocacao = new locacaoJogo();
                    novaLocacao.idJogo = item;
                    novaLocacao.idUsuario = corpo.idUsuario;
                    baseUsuarios.locacaoJogos.Add(novaLocacao);
                    baseUsuarios.SaveChanges();                    
                }
                                
                return "Locação realizada, devolver em 72 horas";
            });

            app.MapGet("/listar-locacoes", (BaseUsuarios baseUsuarios) =>
            {
                return baseUsuarios.locacaoJogos.ToList();
            });

            ///////////////////////
			//EXECUCAO DA APLICACAO
			///////////////////////
			
			//roda aplicacao na porta 3000 (arbitraria)
			app.Run("http://localhost:3000");
            
        }
    }
}
