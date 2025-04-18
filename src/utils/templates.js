export const sendCodeTemplate = (name, code) => {
  return `
<h1 style="text-align: center; padding: 20px; background-color: #111111; color: white; text-align: center; font-size: 30px;">¡BIENVENID@ A Daily Planner!</h1>
<table>
  <tr>
    <td>
      <p style="padding: 0 40px; color: black;">${name} Estamos encantados de tenerte como parte de nuestra comunidad. </p>
      <p style="padding: 0 40px; color: black;">Para continuar con el proceso de recuperación de contraseña proporciona el siguiente codigo:</p>
      <p style="padding: 0 40px; color: black;">Codigo temporal: ${code}</p>
      <p style="padding: 5px 40px; color: black;">Atentamente, <br>
      <span style="font-weight: bold;">El Equipo de Daily Planner</span> </p>
    </td>
  </tr>
</table>`;
};
