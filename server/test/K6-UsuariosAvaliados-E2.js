const http = require("k6/http");
const { sleep, check } = require("k6");

export const options = {
  // Configurações principais para o teste de carga
  stages: [
    { duration: "5m", target: 100 }, // aumento gradual do tráfego de 1 a 100 usuários em 5 minutos.
    { duration: "15m", target: 100 }, // permanece em 100 usuários por 15 minutos
    { duration: "5m", target: 0 }, // diminuição gradual para 0 usuários
  ],
};

export default function teste() {
  let res = http.get("http://localhost:1003/api/usuarios/1/avaliacoes-feitas");

  check(res, {
    "status is 200": (r) => r.status == 200, // Verificação se a requisição foi realizada
    "transaction time < 1s": (r) => r.timings.duration < 1000, // Verificação se a requisição durou menos que 1s
  });
  sleep(1); // Aguardando 1s para realizar a próxima requisição
}
