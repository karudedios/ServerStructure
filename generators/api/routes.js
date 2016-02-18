import { Router } from 'express';
<%
const generateImport = (obj) => `import ${obj.name}Routes from '${obj.path}/routes';\n`;
_.forEach(components, obj => { %><%= generateImport(obj) %><% })
%>
export default Router()<%
  const generateUse = (obj) => `\n\t.use('${obj.path.toLowerCase().slice(1)}', ${obj.name}Routes)`;
  _.forEach(components, route => { %><%= generateUse(route) %><% })
%>;
