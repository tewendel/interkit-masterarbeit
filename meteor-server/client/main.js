import { Meteor } from 'meteor/meteor';
import App from '../components/App.svelte';

 Meteor.startup(() => {
  new App({
    target: document.getElementById('app')
  });
});
