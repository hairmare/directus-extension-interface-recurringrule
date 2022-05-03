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
		<v-select inline :model-value="freq" :items="props.freq_choices" :disabled="disabled"
			@update:model-value="isValid && (freq = $event)">
			<template v-if="props.freq_icon" #prepend>
				<v-icon :name="props.freq_icon" />
			</template>
		</v-select>
		<span class="field-name">By Week Day</span>
		<v-select inline multiple :model-value="byweekday" :items="props.byweekday_choices" :disabled="disabled"
			:mandatory="false" :close-on-content-click="false" @update:model-value="isValid && (byweekday = $event)">
			<template v-if="props.byweekday_icon" #prepend>
				<v-icon :name="props.byweekday_icon" />
			</template>
		</v-select>
		<span class="field-name">Interval</span>
		<v-input inline type="number" :model-value="interval" :disabled="disabled"
			@update:model-value="isValid && (interval = $event)">
			<template v-if="props.interval_icon" #prepend>
				<v-icon :name="props.interval_icon" />
			</template>
		</v-input>
		<span class="field-name">Raw</span>
		<v-input v-model="props.value" @update:model-value="isValid && emit('input', $event)" />
		<v-divider inline-title>
			RRULE format
		</v-divider>
		<pre>{{ props.value }}</pre>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RRule, Weekday, Frequency } from 'rrule';

type Option = {
	text: string;
	value: string | number | boolean | Weekday;
	children?: Option[];
};

interface Props {
	// options
	disabled?: boolean;
	allowNone?: boolean;
	// value
	value: string;
	// rrule specifics
	freq_choices: Array<Option>;
	freq_icon?: string;
	interval_icon?: string;
	wkst?: Weekday;
	byweekday?: Array<Weekday>;
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
		{ text: 'Monday', value: RRule.MO.weekday },
		{ text: 'Tuesday', value: RRule.TU.weekday },
		{ text: 'Wednesday', value: RRule.WE.weekday },
		{ text: 'Thursday', value: RRule.TH.weekday },
		{ text: 'Friday', value: RRule.FR.weekday },
		{ text: 'Saturday', value: RRule.SA.weekday },
		{ text: 'Sunday', value: RRule.SU.weekday },
	]
});
const emit = defineEmits<Emits>();

const fromString = (s: string) => {
	try {
		return {
			rule: RRule.fromString(s),
			valid: true
		};
	} catch (e) {
		return {
			rule: new RRule(),
			valid: false
		};
	}
}

const isValid = computed(() => {
	const { valid } = fromString(props.value);
	return valid;
});

const ruleText = computed(() => {
	const { rule, valid } = fromString(props.value);
	if (!valid) {
		return "";
	}
	return rule.toText();
});

const freq = computed({
	get() {
		const { rule, valid } = fromString(props.value);
		if (valid) {
			return rule.options.freq;
		}
	},
	set(newFreq: Frequency) {
		console.log("setting freq to ", newFreq);
		const { rule, valid } = fromString(props.value);
		if (!valid) {
			return;
		}
		const updated = new RRule({
			...rule.origOptions,
			freq: newFreq
		});
		emit('input', updated.toString());
	}
});

const byweekday = computed({
	get() {
		const { rule, valid } = fromString(props.value);
		if (valid) {
			return rule.options.byweekday;
		}
	},
	set(newByweekday: Frequency[] | undefined) {
		console.log("setting byweekday to ", newByweekday);
		const { rule, valid } = fromString(props.value);
		if (!valid) {
			return;
		}
		let newOpts = {
			...rule.origOptions,
			byweekday: newByweekday
		};
		// handle deselect all case, under the hood the current day of week will be selected
		if (newByweekday === null) {
			delete newOpts.byweekday;
		}
		const updated = new RRule(newOpts);
		emit('input', updated.toString());
	}
});

const interval = computed({
	get() {
		const { rule, valid } = fromString(props.value);
		if (valid) {
			return rule.options.interval;
		}
	},
	set(newInterval: number) {
		console.log("setting interval to ", newInterval);
		const { rule, valid } = fromString(props.value);
		if (!valid) {
			return;
		}
		const updated = new RRule({
			...rule.origOptions,
			interval: newInterval
		});
		emit('input', updated.toString());
	}
});
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
