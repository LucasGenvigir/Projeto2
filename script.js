document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const addButton = document.getElementById('add-btn');
    const clearButton = document.getElementById('clear-btn');
    const clearAllButton = document.getElementById('clear-all-btn');
    const userList = document.getElementById('user-list');
    const searchInput = document.getElementById('search');

    // Carregar itens do armazenamento local
    const loadItems = () => {
        userList.innerHTML = '';
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.forEach(user => addItemToList(user));
    };

    // Salvar item no armazenamento local
    const saveItem = (item) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(item);
        localStorage.setItem('users', JSON.stringify(users));
    };

    // Adicionar item à lista
    const addItemToList = (item) => {
        const li = document.createElement('li');
        li.classList.add('user-item'); // Adicionando classe ao elemento li

        const userInfo = document.createElement('span');
        userInfo.textContent = `${item.date} - ${item.name} - ${item.email}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit-btn'); // Adicionando classe para estilização
        editButton.addEventListener('click', () => {
            editItem(item);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('delete-btn'); // Adicionando classe para estilização
        deleteButton.addEventListener('click', () => {
            deleteItem(item);
        });

        li.appendChild(userInfo);
        li.appendChild(editButton); // Adicionando botão de editar ao elemento li
        li.appendChild(deleteButton); // Adicionando botão ao elemento li
        userList.appendChild(li);
    };

    // Função para editar um item da lista
    const editItem = (item) => {
        const newName = prompt('Digite o novo nome (deixe em branco para manter o mesmo):', item.name);
        if (newName !== null) {
            const newEmail = prompt('Digite o novo email (deixe em branco para manter o mesmo):', item.email);
            if (newEmail !== null) {
                // Atualiza apenas se os campos não estiverem em branco
                const editedItem = {
                    date: item.date,
                    name: newName || item.name, // Mantém o mesmo nome se o campo estiver em branco
                    email: newEmail || item.email, // Mantém o mesmo email se o campo estiver em branco
                };
                updateItem(item, editedItem);
            }
        }
    };

    // Função para atualizar um item na lista
    const updateItem = (oldItem, newItem) => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.map(user => {
            if (user.date === oldItem.date && user.name === oldItem.name && user.email === oldItem.email) {
                return newItem; // Substitui o item antigo pelo novo
            }
            return user;
        });
        localStorage.setItem('users', JSON.stringify(users));
        loadItems(); // Recarrega os itens atualizados na lista
    };

    // Excluir item do armazenamento local e da lista
    const deleteItem = (item) => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(user => user.date !== item.date || user.name !== item.name || user.email !== item.email);
        localStorage.setItem('users', JSON.stringify(users));
        loadItems();
    };

    // Função para adicionar um novo item
    const handleAddItem = () => {
        const name = nameInput.value;
        const email = emailInput.value;
        if (name && email) {
            /*const date = new Date().toLocaleString();*/
            const date = new Date().toLocaleDateString(); // Apenas a data, sem a hora
            const user = { date, name, email };
            saveItem(user);
            addItemToList(user);
            form.reset();
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    };

    // Adicionar evento de clique ao botão "Cadastrar"
    addButton.addEventListener('click', () => {
        handleAddItem();
    });

    // Adicionar evento de submissão ao formulário para capturar a tecla Enter
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        handleAddItem();
    });

    // Adicionar evento de tecla ao formulário para capturar a tecla Enter
    form.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddItem();
        }
    });

    // Adicionar evento de tecla ao formulário para navegar entre os campos
    form.addEventListener('keydown', (event) => {
        const activeElement = document.activeElement; // Elemento atualmente focado

        // Se a tecla pressionada for a seta para cima
        if (event.key === 'ArrowUp') {
            event.preventDefault(); // Impede o comportamento padrão do navegador

            // Se o campo ativo for o email, foca no campo de nome
            if (activeElement === emailInput) {
                nameInput.focus();
            }
        }
        // Se a tecla pressionada for a seta para baixo
        else if (event.key === 'ArrowDown') {
            event.preventDefault(); // Impede o comportamento padrão do navegador

            // Se o campo ativo for o nome, foca no campo de email
            if (activeElement === nameInput) {
                emailInput.focus();
            }
        }
    });

    // Limpar campos do formulário
    clearButton.addEventListener('click', () => {
        form.reset();
    });

    // Limpar todos os itens
    clearAllButton.addEventListener('click', () => {
        localStorage.removeItem('users');
        loadItems();
    });
    // Pesquisar itens usando o método filter
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );

        userList.innerHTML = '';
        filteredUsers.forEach(user => addItemToList(user));
    });

    // Carregar Itens Inicialmente
    loadItems();
});
