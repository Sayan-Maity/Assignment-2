import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    dashboard: {
      dashboard_green_gradient: "#3ce2ad6e",
      dashboard_blue_gradient: "#0078aa78",
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
)
