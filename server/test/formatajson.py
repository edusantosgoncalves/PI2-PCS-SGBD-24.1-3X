import json


def fix_json_array(input_file, output_file):
    with open(input_file, "r") as file:
        # Lê o conteúdo do arquivo
        content = file.read()

    # Remove quebras de linha extras e espaços em branco
    content = content.replace("\n", "").replace("\r", "").strip()

    # Substitui a ocorrência de '}{' por '},{' para adicionar vírgulas
    fixed_content = content.replace("}{", "},{")

    # Adiciona colchetes ao redor do conteúdo para formar um array JSON válido
    fixed_content = "[" + fixed_content + "]"

    # Tenta carregar o conteúdo corrigido como JSON para verificar se está correto
    try:
        json_data = json.loads(fixed_content)
    except json.JSONDecodeError as e:
        print("Erro ao decodificar JSON:", e)
        return

    # Salva o conteúdo corrigido em um novo arquivo JSON
    with open(output_file, "w") as out_file:
        json.dump(json_data, out_file, indent=4)

    print(f"Arquivo corrigido salvo como '{output_file}'.")


# Exemplo de uso
input_file = "./resultadoTarefas.json"  # Nome do arquivo de entrada
output_file = "resultadoTarefasFormatado.json"  # Nome do arquivo de saída
fix_json_array(input_file, output_file)
