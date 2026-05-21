import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export default function ListaDeTarefas() {
  const { tema, alternarTema } = useContext(ThemeContext);
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');

  // 1. useEffect com busca inicial e CLEANUP (requisito do PDF)
  useEffect(() => {
    const tarefasSalvas = localStorage.getItem('tarefas');
    if (tarefasSalvas) {
      setTarefas(JSON.parse(tarefasSalvas));
    }

    // Função de limpeza/sincronização caso mude em outra aba
    const sincronizarAbas = (e) => {
      if (e.key === 'tarefas') setTarefas(JSON.parse(e.newValue || '[]'));
    };
    window.addEventListener('storage', sincronizarAbas);

    // CLEANUP executado ao desmontar o componente
    return () => window.removeEventListener('storage', sincronizarAbas);
  }, []);

  // 2. useEffect para persistir os dados sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  // Adicionar mantendo a Imutabilidade
  const adicionarTarefa = () => {
    if (!novaTarefa.trim()) return;
    const nova = { id: Date.now(), texto: novaTarefa, concluida: false };
    setTarefas([...tarefas, nova]);
    novaTarefa;
    setNovaTarefa('');
  };

  // Alternar conclusão mantendo a Imutabilidade (.map)
  const alternarConclusao = (id) => {
    setTarefas(
      tarefas.map((t) => 
        t.id === id ? { ...t, concluida: !t.concluida } : t
      )
    );
  };

  // Remover mantendo a Imutabilidade (.filter)
  const removerTarefa = (id) => {
    setTarefas(tarefas.filter((t) => t.id !== id));
  };

  // Estilos simples para o tema claro/escuro
  const estilosTema = {
    background: tema === 'claro' ? '#ffffff' : '#1e1e1e',
    color: tema === 'claro' ? '#333333' : '#ffffff',
    corDoTitulo: tema === 'claro' ? '#000000' : '#ffffff',
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: 'sans-serif',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={estilosTema}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <button onClick={alternarTema} style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer' }}>
          Mudar para Tema {tema === 'claro' ? 'Escuro' : 'Claro'}
        </button>
        
        <h2 style={{ color: estilosTema.corDoTitulo }}>Lista de Tarefas</h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            type="text" 
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            placeholder="Nova tarefa..."
            style={{ flexGrow: 1, padding: '8px' }}
          />
          <button onClick={adicionarTarefa} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Adicionar
          </button>
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tarefas.map((tarefa) => (
            <li key={tarefa.id} style={{ 
              display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px',
              padding: '8px', borderBottom: '1px solid #ccc'
            }}>
              <input 
                type="checkbox" 
                checked={tarefa.concluida} 
                onChange={() => alternarConclusao(tarefa.id)} 
              />
              <span style={{ 
                textDecoration: tarefa.concluida ? 'line-through' : 'none',
                flexGrow: 1 
              }}>
                {tarefa.texto}
              </span>
              <button 
                onClick={() => removerTarefa(tarefa.id)} 
                style={{ background: 'red', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}