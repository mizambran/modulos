
/* prueba de numeros */

/* let num1 = parseInt(prompt(`Ingrese un número`))

let num2 = parseInt(prompt(`Ingrese otro número`))

let suma = num1 + num2 

document.writeln(`El resultado de ${num1} y ${num2} es igual a ${suma}`) */

/* concatenar texto con espacio */

/* let nombre = prompt("Ingresa tu nombre")

let apellido = prompt("Ahora tu apellido")

let nombreCompleto = nombre + " " + apellido;

document.writeln(`Tu nombre  ${nombre} y tu apellido es ${apellido} entonces te llamas ${nombreCompleto} `) */


/* Calculo Variación Porcentual */
/* 
let costoNuevo = document.getElementById("costoNuevo")

let costoAnterior = document.getElementById("costoAnterior")

let varPorcentual = ((costoNuevo - costoAnterior)/costoAnterior) * 100  

let simbolo = "%"

document.writeln(`La variación es del ${varPorcentual} ${simbolo}`)
 */

/* Calculo variacion porcentual (creando una función) */

function calcular() {
      let costoNuevo = document.getElementById("costoNuevo");
      let costoAnterior = document.getElementById("costoAnterior");
      let valor1 = parseFloat(costoNuevo.value);
      let valor2 = parseFloat(costoAnterior.value);

      if (isNaN(valor1) || isNaN(valor2)) {
          document.getElementById("resultado").value = "Ingrese valores válidos";
          return;
      }

      let variacionPorcentual = ((valor1 - valor2) / valor2) * 100;
      document.getElementById("resultado").value = variacionPorcentual.toFixed(2) + "%";
    }