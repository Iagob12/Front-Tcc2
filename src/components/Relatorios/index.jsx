import { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import MobileWarning from "../MobileWarning";
import "../../styles/PageRelatorios/style.css";
import { FaDownload } from "react-icons/fa";
import { apiGet, createApiUrl } from "../../config/api";

const Relatorios = () => {
    const [seletor, setSeletor] = useState("");

    const downloadFile = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url); // libera memória
    };

    const baixarRelatorio = async (tipo) => {
        try {
            let endpoint = "";
            if (tipo === "USUARIOS") endpoint = "relatorio/usuarios?caminho=qualquer";
            if (tipo === "DOACOES") endpoint = "relatorio/doacoes?caminho=qualquer";

            const response = await apiGet(endpoint);

            if (!response.ok) throw new Error("Erro ao gerar relatório");

            const blob = await response.blob();
            const filename = tipo === "USUARIOS" ? "relatorio_usuarios.pdf" : "relatorio_doacoes.pdf";
            downloadFile(blob, filename);
        } catch (error) {
            console.error("Erro ao baixar relatório:", error);
        }
    };

    return (
        <>
            <Header />
            <MobileWarning pageName="Relatórios" />
            <div className="container-relatorios">
                <section className="content-container-relatorios">
                    <div className="cabecalho-relatorios">
                        <h1>Relatórios</h1>
                        <select
                            value={seletor}
                            onChange={(e) => setSeletor(e.target.value)}
                        >
                            <option value="" disabled hidden>
                                Selecione uma opção
                            </option>
                            <option value="USUARIOS">Usuários</option>
                            <option value="DOACOES">Doações</option>
                        </select>
                    </div>

                    {seletor === "" && <p>Nenhum tipo de relatório selecionado!</p>}

                    {seletor === "USUARIOS" && (
                        <p onClick={() => baixarRelatorio("USUARIOS")} style={{ cursor: "pointer" }}>
                            <FaDownload /> Baixar relatório de usuários
                        </p>
                    )}

                    {seletor === "DOACOES" && (
                        <p onClick={() => baixarRelatorio("DOACOES")} style={{ cursor: "pointer" }}>
                            <FaDownload /> Baixar relatório de doações
                        </p>
                    )}
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Relatorios;
