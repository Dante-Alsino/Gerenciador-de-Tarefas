<div align="center">
  <h1>✅ Gerenciador de Tarefas</h1>
  <p><strong>Uma aplicação web ágil e client-side para organização de rotinas e aumento de produtividade.</strong></p>

  <p>
    🌍 <strong>Versão Publicada:</strong> <a href="#">Acesse o projeto online aqui</a> *(Em breve)*
  </p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-success?style=for-the-badge" alt="Status" />
</div>

<br>

## 📖 Sobre o Projeto

Manter uma rotina organizada é o primeiro passo para o sucesso. O **Gerenciador de Tarefas** é uma aplicação interativa *Single-Page* construída inteiramente com Vanilla JavaScript. Ele resolve o problema do esquecimento e da procrastinação permitindo o registro rápido de atividades diárias, categorização e acompanhamento de status.

> 💡 **Diferencial:** Os dados não são perdidos! A aplicação utiliza o `localStorage` do navegador para garantir a persistência das informações de forma 100% *client-side*, sem necessidade de um backend ou banco de dados.

---

## ✨ Features Principais

- **📝 CRUD de Tarefas:** Crie, leia, atualize o status (concluir) e exclua tarefas.
- **🏷️ Categorização e Prioridades:** Defina a urgência (Alta, Média, Baixa) e a categoria de cada atividade.
- **💾 Persistência Local:** Sincronização automática e reativa com o `localStorage`.
- **📊 Dashboard de Indicadores:** Resumo dinâmico (Total, Pendentes, Concluídas).
- **🔍 Filtros Avançados:** Visualize apenas o que importa no momento filtrando por situação e categorias.
- **🛡️ Validação de Dados:** Formulários inteligentes que previnem o cadastro de dados vazios ou inconsistentes.

---

## 🛠️ Tecnologias Utilizadas

A arquitetura foi pensada para ser leve, sem dependências externas, focando nos fundamentos da Web:

- **Frontend:** HTML5 Semântico, CSS3 (Flexbox/Grid para Layout)
- **Lógica e Interatividade:** JavaScript ES6+ (Manipulação de DOM, Eventos, Arrays, Objetos)
- **Armazenamento:** Web Storage API (`localStorage`)

---

## 🚀 Pré-requisitos & Instalação

Por ser uma aplicação estática e *client-side*, não há necessidade de instalação de dependências ou build complexo.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Dante-Alsino/Gerenciador-de-Tarefas.git
   ```

2. **Acesse o diretório:**
   ```bash
   cd Gerenciador-de-Tarefas
   ```

3. **Execute a aplicação:**
   Basta abrir o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Edge, Safari).
   *Dica:* Caso utilize o VS Code, você pode usar a extensão **Live Server** para uma experiência com *hot-reload*.

---

## 🤝 Como Contribuir

Este projeto segue padrões rígidos de qualidade de código e versionamento.

1. Faça um **Fork** do projeto
2. Crie uma **Branch** para sua feature (`git checkout -b feature/MinhaFeatureIncrivel`)
3. Faça o **Commit** de suas alterações utilizando [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: adiciona filtro por data`
   - `fix: corrige bug de renderização no localStorage`
   - `style: melhora contraste dos botões`
4. Faça o **Push** para a branch (`git push origin feature/MinhaFeatureIncrivel`)
5. Abra um **Pull Request** detalhando suas alterações.

---

## 📄 Licença & Autoria

Desenvolvido como exercício prático do Programa de Formação Acelerada - Bolsa Futuro Digital.

Distribuído sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.
