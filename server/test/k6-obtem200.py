import json


def read_and_export_json(input_file, output_file, limit=200):
    with open(input_file, "r") as file:
        # Carrega o conteúdo JSON do arquivo
        data = json.load(file)

    # Seleciona os primeiros 200 objetos do array
    selected_data = data[:limit]

    # Salva os objetos selecionados em um novo arquivo JSON
    with open(output_file, "w") as out_file:
        json.dump(selected_data, out_file, indent=4)

    print(f"Arquivo exportado: '{output_file}'")


# Exemplo de uso
input_file = "./resultadoTarefasFormatado.json"  # Nome do arquivo de entrada
output_file = "./resultadoTarefasFormatado200.json"  # Nome do arquivo de saída
read_and_export_json(input_file, output_file)
