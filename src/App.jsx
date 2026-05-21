import { ThemeProvider } from './contexts/ThemeContext';
import ListaDeTarefas from './components/ListaDeTarefas';

function App() {
  return (
    <ThemeProvider>
      <ListaDeTarefas />
    </ThemeProvider>
  );
}

export default App;