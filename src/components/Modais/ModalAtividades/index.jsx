import { useEffect, useRef } from "react";
import Button from "../../Button";
import "../../../styles/Modais/modalAtividades/style.css";

const ModalAtividades = ({ aula, data, horario, descricao, isOpen, onClose, position, onInscrever}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let hasMoved = false;

    function handleClickOutside(event) {
      // Verifica se o clique foi fora do modal
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    function handleTouchStart(event) {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      hasMoved = false;
    }

    function handleTouchMove(event) {
      // Ignora movimento dentro do modal para permitir cliques
      if (modalRef.current && modalRef.current.contains(event.target)) {
        return;
      }
      
      if (!hasMoved) {
        const deltaX = Math.abs(event.touches[0].clientX - startX);
        const deltaY = Math.abs(event.touches[0].clientY - startY);
        
        // Aumenta toleração para 30px para permitir pequenos movimentos ao clicar
        if (deltaX > 30 || deltaY > 30) {
          hasMoved = true;
          onClose();
        }
      }
    }

    function handleMouseDown(event) {
      // Ignora se clicou no modal
      if (modalRef.current && modalRef.current.contains(event.target)) {
        return;
      }
      startX = event.clientX;
      startY = event.clientY;
      hasMoved = false;
    }

    function handleMouseMove(event) {
      if (!hasMoved && startX !== 0) {
        const deltaX = Math.abs(event.clientX - startX);
        const deltaY = Math.abs(event.clientY - startY);
        
        // Se moveu mais de 3px, fecha o modal (bem sensível)
        if (deltaX > 3 || deltaY > 3) {
          hasMoved = true;
          onClose();
        }
      }
    }

    function handleScroll() {
      onClose();
    }

    function handleWheel() {
      onClose();
    }

    if (isOpen) {
      // Adiciona listeners em todos os elementos que podem ter scroll
      const swiperContainers = document.querySelectorAll('.swiper, .swiper-wrapper, .atividades-container');
      
      const timer = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
        document.addEventListener("touchstart", handleTouchStart, { passive: true });
        document.addEventListener("touchmove", handleTouchMove, { passive: true });
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("scroll", handleScroll, true);
        document.addEventListener("wheel", handleWheel, { passive: true });
        window.addEventListener("scroll", handleScroll, true);
        
        // Adiciona listener em cada container do Swiper
        swiperContainers.forEach(container => {
          container.addEventListener("scroll", handleScroll, true);
          container.addEventListener("touchmove", handleScroll, { passive: true });
        });
      }, 150);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("scroll", handleScroll, true);
        document.removeEventListener("wheel", handleWheel);
        window.removeEventListener("scroll", handleScroll, true);
        
        swiperContainers.forEach(container => {
          container.removeEventListener("scroll", handleScroll, true);
          container.removeEventListener("touchmove", handleScroll);
        });
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !position) return null;

  const isMobile = window.innerWidth <= 768;
  
  // Mantém o mesmo tamanho do card original
  const modalStyle = {
    position: "fixed",
    top: `${position.top}px`,
    left: `${position.left}px`,
    width: `${position.width}px`,
    height: `${position.height}px`,
    zIndex: 1501,
  };

  // Função para truncar texto longo
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      ref={modalRef} 
      className="modal-atividade-container-positioned"
      style={modalStyle}
      onMouseLeave={!isMobile ? onClose : undefined}
    >
      <h3>{aula}</h3>
      <p className="modal-data">{data}</p>
      <p className="modal-descricao">{truncateText(descricao)}</p>
      <p className="modal-horario">{horario}</p>
      <Button text="Inscrever-se" onClick={onInscrever} />
    </div>
  );
};

export default ModalAtividades;