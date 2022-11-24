import { Group, MantineProvider } from '@mantine/core';
import './App.css';
import NavBar from './components/navbar';
import DashboardPage from './containers/dashboard';

function App() {
  return (
    <MantineProvider>
      <div className="App">
        <Group 
          dir="row" 
          noWrap 
          grow
          spacing={0} 
          align="flex-start" 
          sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}
        >
          <NavBar />
          <DashboardPage />
        </Group>
      </div>
    </MantineProvider>
  );
}

export default App;
