import { useNavigate } from 'react-router-dom';
import { useUI } from '../../lib/ui';
import { Drawer } from './Drawer';
import { ContactForm } from './ContactForm';
import { site } from '../../data/site';

export function ContactDrawer() {
  const { contactOpen, closeContact } = useUI();
  const navigate = useNavigate();
  return (
    <Drawer open={contactOpen} onClose={closeContact} title="Iniciar um projeto">
      <div className="grid gap-10 pt-4">
        <header className="grid gap-4">
          <span data-d-item className="label text-sand">Contato · {site.city}</span>
          <h2 data-d-item className="display h-lg">Conte sobre o seu projeto.</h2>
          <p data-d-item className="max-w-[52ch] text-paper/70">Quanto mais contexto, melhor a primeira conversa: o que você imagina, onde fica o imóvel e quando gostaria de começar.</p>
        </header>
        <ContactForm onOpenPrivacy={() => { closeContact(); window.setTimeout(() => navigate('/privacidade'), 500); }} />
      </div>
    </Drawer>
  );
}
