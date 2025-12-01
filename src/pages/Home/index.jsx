import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Main from "../../components/PageHome/main";
import AtividadeSection from "../../components/PageHome/atividade-section";
import EstatisticaSection from "../../components/PageHome/estatisticas-section";
import CarrosselSection from "../../components/PageHome/carrossel-section";
import EmailSection from "../../components/PageHome/email-section";
import ModalInstalarApp from "../../components/Modais/ModalInstalarApp";
import AppPromoBanner from "../../components/AppPromoBanner";
import { useAppInstallPrompt } from "../../hooks/useAppInstallPrompt";

const Home = () => {
    const { showModal, isMobile, closeModal } = useAppInstallPrompt();

    return (
        <>
            <Header />
            <Main />
            <AtividadeSection />
            <EstatisticaSection />
            <CarrosselSection />
            <EmailSection />
            <Footer />
            <AppPromoBanner />
            <ModalInstalarApp 
                isOpen={showModal} 
                onClose={closeModal} 
                isMobile={isMobile} 
            />
        </>
    );
}

export default Home;
