import { defineInterface } from '@directus/extensions-sdk';
import InterfaceRecurringRule from './recurring-rule.vue';

export default defineInterface({
	id: 'recurring-rule',
	name: '$t:interfaces.recurring-rule.name',
	icon: 'edit_calendar',
	description: '$t:interfaces.recurring-rule.description',
	component: InterfaceRecurringRule,
	options: [],
	types: ['string'],
});
