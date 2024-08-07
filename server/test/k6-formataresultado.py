import json


def format_metrics(input_file, output_file):
    with open(input_file, "r") as file:
        # Carrega o conteúdo JSON do arquivo
        data = json.load(file)

    formatted_data = []

    # Para cada item no array...
    for item in data:
        # Verificando se o item tem "data.value", se não tiver, vá para o proximo
        if "data" in item and "value" in item["data"]:
            metric = item.get("metric")
            value = item["data"]["value"]
            itemtype = item["type"]
            timestamp = item["data"]["time"]

            if metric == "checks":
                # Formatação específica para "checks"
                metric = item["data"]["tags"]["check"]
                formatted_data.append(
                    {
                        "metric": metric,
                        "value": value,
                        "data": timestamp,
                        "type": itemtype,
                    }
                )
            else:
                # Formatação padrão
                formatted_data.append(
                    {
                        "metric": metric,
                        "value": value,
                        "data": timestamp,
                        "type": itemtype,
                    }
                )

    # Salva os dados formatados em um novo arquivo JSON
    with open(output_file, "w") as out_file:
        json.dump(formatted_data, out_file, indent=4)

    print(f"Arquivo formatado salvo como '{output_file}'.")


# Exemplo de uso
input_file = "./resultadoUsuariosFormatado.json"  # Nome do arquivo de entrada
output_file = "./resultadoUsuariosFormatadoLimpo.json"  # Nome do arquivo de saída
format_metrics(input_file, output_file)
