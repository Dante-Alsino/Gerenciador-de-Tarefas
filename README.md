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
  <img src="https://img.shields.io/badge/Status-Conclu%C3%ADdo-success?style=for-the-badge" alt="Status" />
</div>

<br>

## 📖 Sobre o Projeto

Manter uma rotina organizada é o primeiro passo para o sucesso. O **Gerenciador de Tarefas** é uma aplicação interativa construída no modelo *Single-Page Application* com Vanilla JavaScript, estruturada através de um intuitivo **quadro Kanban**. Ele resolve o problema da desorganização diária permitindo o cadastro rápido de atividades, distribuição por grau de esforço, filtragem em tempo real e acompanhamento de status.

> 💡 **Diferencial:** Os dados não são perdidos! A aplicação utiliza o `localStorage` do navegador para garantir a persistência das informações de forma 100% *client-side*, sem necessidade de um backend ou banco de dados.

---

## ✨ Features Principais

- **📋 Quadro Kanban Interativo:** Organização visual distribuída em colunas segmentadas por nível de dificuldade (*Fácil*, *Moderado*, *Difícil*) e coluna dedicada para tarefas *Concluídas*.
- **📝 CRUD Completo:** Cadastro com validação de campos obrigatórios, exclusão com diálogo de confirmação e alternância de status (*Concluir* / *Desfazer*).
- **🏷️ Categorização e Complexidade:** Classificação de atividades por grau de esforço e categorias extraídas dinamicamente dos dados cadastrados.
- **💾 Persistência Local Resiliente:** Sincronização automática com o `localStorage` do navegador, com tratamento defensivo de erros (`try/catch`).
- **📊 Dashboard de Indicadores:** Contadores globais em tempo real (Total de tarefas, Pendentes e Concluídas).
- **🔍 Filtros Dinâmicos e Não Destrutivos:** Filtragem combinada por situação e por categoria atuando exclusivamente na camada de exibição.
- **📭 Gestão de Estado Vazio (Empty State):** Interface com feedback orientador e acessibilidade (`aria-live`) quando nenhuma tarefa está cadastrada.
- **🛡️ Segurança e Performance:** Sanitização contra injeções de script (proteção XSS) e otimização de memória via Delegação de Eventos (*Event Delegation*).

---

## 🛠️ Tecnologias Utilizadas

A arquitetura foi concebida para ser leve, acessível e sem dependências externas, explorando o potencial dos fundamentos da Web moderna:

- **Frontend:** HTML5 Semântico, CSS3 (CSS Grid, Flexbox e Variáveis CSS personalizadas)
- **Lógica e Interatividade:** JavaScript ES6+ (Delegação de Eventos, UUIDs, Manipulação de DOM nativa e Proteção XSS)
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
