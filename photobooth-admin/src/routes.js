import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Clients = React.lazy(() => import('./views/Clients'));
const Events = React.lazy(() => import('./views/Events'));
const EditProfile = React.lazy(() => import('./views/EditProfile'));
const EditEvent = React.lazy(() => import('./views/EditEvent'));
const CloneEditEvent = React.lazy(() => import('./views/EditEvent/CloneEditEvent'));

const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/clients', exact: true, name: 'Clients', component: Clients },
  { path: '/events', exact: true, name: 'Events', component: Events },
  { path: '/eventedit', exact: true, name: 'Edit Event', component: EditEvent },
  { path: '/eventedit/:id', exact: true, name: 'Edit Event', component: EditEvent },
  { path: '/eventcloneedit/:id', exact: true, name: 'Edit Event', component: CloneEditEvent },
  { path: '/editprofile', exact: true, name: 'Edit Profile', component: EditProfile },
];

export default routes;
