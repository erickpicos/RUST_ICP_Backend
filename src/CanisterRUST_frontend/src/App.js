import { html, render } from 'lit-html';
import { CanisterRUST_backend } from 'declarations/CanisterRUST_backend';
import logo from './logo2.svg';

class App {
  // Mensajes para diferentes secciones
  registerMessage = '';
  allUsersMessage = '';
  profileMessage = '';

  constructor() {
    this.#render();
  }

  // Registro de usuario
  #handleRegister = async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    this.registerMessage = await CanisterRUST_backend.register_user(name, email);
    this.#render();
  };


  #handleGetAllUsers = async (e) => {
    e.preventDefault();
    const users = await CanisterRUST_backend.get_all_users();
    
    if (users.length > 0) {
      this.allUsersMessage = html`
        ${users.map(user => html`
          <div class="user-card">
            <h3>${user.name}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Registered:</strong> ${user.registration_date}</p>
          </div>
        `)}
      `;
    } else {
      this.allUsersMessage = "No users registered.";
    }
    
    this.#render();
  };

  #handleGetProfile = async (e) => {
    e.preventDefault();
    const id = document.getElementById('profileId').value;
  
    // Asegúrate de que 'id' sea un formato correcto para Principal
    const users = await CanisterRUST_backend.get_user_profile(id);

    if (users.length > 0) {
      this.profileMessage = html`
        ${users.map(user => html`
          <div class="user-card">
            <h3>${user.name}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Registered:</strong> ${user.registration_date}</p>
          </div>
        `)}
      `;
    } else {
      this.profileMessage = "No users registered.";
    }
    
    this.#render();
  };


  // Renderizar el formulario y las secciones
  #render() {
    let body = html`
    <main>
      <img src="${logo}" alt="DFINITY logo" />
      <br /><br />
      
      <!-- Registro de usuario -->
      <div style="background-color: #e0f7e0; padding: 20px; margin-bottom: 20px;">
        <h2>Registro de Usuario</h2>
        <form id="registerForm">
          <label for="name">Enter your name: &nbsp;</label>
          <input id="name" alt="Name" type="text" />
          <br />
          <label for="email">Enter your email: &nbsp;</label>
          <input id="email" alt="Email" type="email" />
          <br />
          <button type="submit">Register Me!</button>
        </form>
        <section id="registerMessage">${this.registerMessage}</section>
      </div>

      <br />

      <!-- Obtener todos los usuarios -->
      <div style="background-color: #e0f7e0; padding: 20px; margin-bottom: 20px;">
        <h2>Obtener Todos los Usuarios</h2>
        <button id="getAllUsers">Get All Users</button>
        <pre id="allUsersMessage">${this.allUsersMessage}</pre>
      </div>

      <br />

      <!-- Obtener perfil de usuario -->
      <div style="background-color: #e0f7e0; padding: 20px; margin-bottom: 20px;">
        <h2>Obtener Perfil de Usuario</h2>
        <form id="profileForm">
          <label for="profileId">Enter user Email: &nbsp;</label>
          <input id="profileId" alt="Profile Email" type="text" />
          <button type="submit">Get User Profile</button>
        </form>
        <section id="profileMessage">${this.profileMessage}</section>
      </div>

    </main>
  `;

    render(body, document.getElementById('root'));

    // Agregar eventos a cada formulario y botón
    document
      .getElementById('registerForm')
      .addEventListener('submit', this.#handleRegister);
    document
      .getElementById('getAllUsers')
      .addEventListener('click', this.#handleGetAllUsers);
    document
      .getElementById('profileForm')
      .addEventListener('submit', this.#handleGetProfile);
  }
}

export default App;