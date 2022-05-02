<template>
	<div>
		<v-divider inline-title>
			Human readable
		</v-divider>
		<p>{{ ruleText }}</p>
		<v-divider inline-title>
			Options
		</v-divider>
		<span class="field-name">Frequency</span>
		<v-select inline :model-value="freq" :items="props.freq_choices" :disabled="disabled" :show-deselect="allowNone"
			:allow-other="allowOther" @update:model-value="freq = $event; handleChange()">
			<template v-slot:prepend-outer>
				<span class="field-name">T0</span>
			</template>
			<template v-slot:prepend>
				<span class="field-name">T2</span>
			</template>
			<template v-if="props.freq_icon" #prepend>
				<v-icon :name="props.freq_icon" />
			</template>
		</v-select>
		<span class="field-name">By Week Day</span>
		<v-select inline multiple :model-value="byweekday" :items="props.byweekday_choices" :disabled="disabled"
			:close-on-content-click="false" @update:model-value="byweekday = $event; handleChange()">
			<template v-if="props.byweekday_icon" #prepend>
				<v-icon :name="props.byweekday_icon" />
			</template>
		</v-select>
		<span class="field-name">Interval</span>
		<v-input inline type="number" :model-value="interval" :disabled="disabled"
			@update:model-value="interval = $event; handleChange()">
			<template v-if="props.interval_icon" #prepend>
				<v-icon :name="props.interval_icon" />
			</template>
		</v-input>
		<v-divider inline-title>
			RRULE format
		</v-divider>
		<pre>{{ props.value }}</pre>
	</div>
</template>

<script setup lang="ts">
import { Prop, PropType } from 'vue';
import { RRule, Weekday } from 'rrule';

type Option = {
	text: string;
	value: string | number | boolean | Weekday;
	children?: Option[];
};
type OptionPropType = PropType<Option>;

interface Props {
	// options
	disabled?: boolean;
	allowNone?: boolean;
	allowOther?: boolean;
	// value
	value: string;
	// rrule specifics
	freq_choices: Array<Option>;
	freq_icon?: string;
	interval_icon?: string;
	wkst?: Weekday;
	byweekday?: number;
	byweekday_choices: Array<Option>;
	byweekday_icon?: string;
}

interface Emits {
	(e: 'input', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
	value: "",
	freq_choices: () => [
		{ text: 'Every year', value: RRule.YEARLY },
		{ text: 'Every month', value: RRule.MONTHLY },
		{ text: 'Every week', value: RRule.WEEKLY },
		{ text: 'Every day', value: RRule.DAILY },
		{ text: 'Every hour', value: RRule.HOURLY },
		{ text: 'Every minute', value: RRule.MINUTELY },
		{ text: 'Every second', value: RRule.SECONDLY },
	],
	wkst: () => RRule.MO,
	byweekday_choices: () => [
		{ text: 'Monday', value: RRule.MO },
		{ text: 'Tuesday', value: RRule.TU },
		{ text: 'Wednesday', value: RRule.WE },
		{ text: 'Thursday', value: RRule.TH },
		{ text: 'Friday', value: RRule.FR },
		{ text: 'Saturday', value: RRule.SA },
		{ text: 'Sunday', value: RRule.SU },
	]
});
const emit = defineEmits<Emits>();

let ruleText: string = ""
let freq: number = RRule.WEEKLY;
let interval: number = 1;
let byweekday: Weekday[] = [RRule.MO];

function handleChange(): void {
	const rule = new RRule({
		freq: freq,
		interval: interval,
		wkst: props.wkst,
		byweekday: byweekday,
	});

	ruleText = rule.toText();
	console.log(ruleText);
	emit('input', rule.toString());
}
</script>

<style scoped>
.field-name {
	font-weight: bold;
	display: block;
}

.field-name:after {
	content: ':';
}
</style>