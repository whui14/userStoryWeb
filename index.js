// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import { DatePicker } from 'antd';

// function App() {
//   return (
//     <div style={{ margin: 100 }}>
//       <h1>AntDesign Demo</h1>
//       <hr /><br />
//       <DatePicker />
//     </div>
//   );
// }

// ReactDOM.render(<App />, document.getElementById('root'));


import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router';
import ReactDOM from 'react-dom';
import App from './src/App'
import './src/styles.css';

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
