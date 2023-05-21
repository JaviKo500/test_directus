import { defineDisplay } from '@directus/extensions-sdk';
import DisplayComponent from './display.vue';

export default defineDisplay({
	id: 'test',
	name: 'test',
	icon: 'box',
	description: 'This is my custom display!',
	component: DisplayComponent,
	handler:  (value, options, ctx) => {
		console.log('<--------------- JK Index --------------->');
		console.log(ctx, options,value);
		return ''
	},
	options: null,
	types: ['string'],
});
