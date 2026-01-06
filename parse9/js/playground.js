/* saveClient(client){

    const clientsDB = new IDB("MeuDB", "clients", {
        keyPath: "id",
        autoIncrement: false,
        indexes: [
            { name: "route_code", key: "route" },
            { name: "client_name", key: "client" }
        ]
    });


    (async () => {
        console.log("Iniciando o salvamento de todos os clientes em uma única transação...");

        try {
            // Chama o novo método saveAll com o array completo
            const savedKeys = await clientsDB.saveAll(CLIENTS_DATA);
            
            console.log(`Sucesso! Foram salvos ${savedKeys.length} clientes.`);
            console.log("Chaves dos clientes salvos (devem ser os IDs):", savedKeys);
            
        } catch (error) {
            console.error("Erro ao salvar o array de clientes:", error);
        }
    })();
} */