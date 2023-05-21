<template>
	<div class="field">
		<div class="type-label">Opciones</div>
		<v-select
			v-model="tableSpacingWritable"
			:items="[
				{
					text: 'compact',
					value: 'compact',
				},
				{
					text: 'cozy',
					value: 'cozy',
				},
				{
					text: 'comfortable',
					value: 'comfortable',
				},
			]"
		/>
	</div>
</template>

<script lang="ts">
export default {
	inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { useSync } from '@directus/composables';
import { Field } from '@directus/types';

interface Props {
	fields: string[];
	activeFields: Field[];
	tableSpacing: 'compact' | 'cozy' | 'comfortable';
}

const props = defineProps<Props>();

const emit = defineEmits(['update:tableSpacing', 'update:activeFields', 'update:fields']);

const tableSpacingWritable = useSync(props, 'tableSpacing', emit);
</script>