import json
import pandas as pd
import matplotlib.pyplot as plt


# Função para filtrar métricas a serem utilizadas
# def format_metrics(input_file, output_file):
def format_metrics(input_file):
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
                        "date": pd.to_datetime(timestamp),
                        "type": itemtype,
                    }
                )
            else:
                # Formatação padrão
                formatted_data.append(
                    {
                        "metric": metric,
                        "value": value,
                        "date": pd.to_datetime(timestamp),
                        "type": itemtype,
                    }
                )

    # Retorna os dados como dataframePandas
    return pd.DataFrame(formatted_data)

    # Salva os dados formatados em um novo arquivo JSON
    """with open(output_file, "w") as out_file:
        json.dump(formatted_data, out_file, indent=4)

    print(f"Arquivo formatado salvo como '{output_file}'.")"""


"""tarefasK6 = "./resultadoTarefas.json"  # Nome do arquivo de entrada
avaliacoesK6 = "./resultadoUsuarios.json"  # Nome do arquivo de saída
format_metrics(input_file, output_file)"""

"""def process_data(data):
    metrics = []
    
    for item in data:
        if 'data' in item and 'value' in item['data']:
            metric_name = item['metric']
            value = item['data']['value']
            timestamp = item['data']['time']
            
            metrics.append({
                'metric': metric_name,
                'value': value,
                'time': pd.to_datetime(timestamp)
            })
    
    return pd.DataFrame(metrics)"""


def plot_metrics(df):
    # Filtra as métricas que queremos plotar
    metrics_to_plot = [
        "http_req_duration",
        "http_reqs",
        "checks",
        "vus",
        "data_sent",
        "data_received",
    ]

    for metric in metrics_to_plot:
        metric_data = df[df["metric"] == metric]

        if not metric_data.empty:
            plt.figure(figsize=(10, 5))
            plt.plot(
                metric_data["time"],
                metric_data["value"],
                marker="o",
                linestyle="-",
                label=metric,
            )
            plt.title(f"Métrica: {metric}")
            plt.xlabel("Tempo")
            plt.ylabel("Valor")
            plt.xticks(rotation=45)
            plt.grid()
            plt.legend()
            plt.tight_layout()
            plt.savefig(f"{metric}.png")  # Salva o gráfico como PNG
            plt.close()


def main():
    tarefasK6 = format_metrics("./resultadoTarefas.json")
    avaliacoesK6 = format_metrics("./resultadoUsuarios.json")
    plot_metrics(tarefasK6)
    plot_metrics(avaliacoesK6)
    print("Gráficos gerados com sucesso.")


if __name__ == "__main__":
    main()
