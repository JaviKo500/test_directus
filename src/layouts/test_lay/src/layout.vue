import { toRefs } from 'vue';
<template>
	<div class="layout-tabular">
		<v-table
		  	:showResize="true"
			ref="table"
			v-model="selectionWritable"
			:headers="tableHeadersWritable"
			:loading="loading"
			:items="items"
		  >
		  <!-- @click:row="onRowClick" -->
		</v-table>
	</div>
</template>

<script setup lang="ts">
	import { toRefs } from 'vue';
	import { Item } from '@directus/types';
import { useCollection, useStores, useSync } from '@directus/extensions-sdk';

	interface Props {
		collection: string;
		items: Item[];
		selection?: Item[];
		tableHeaders: any;
		loading: boolean,
	}

	const props = withDefaults(defineProps<Props>(), {
		selection: () => [],
	});
	const emit = defineEmits(['update:selection', 'update:tableHeaders', 'update:limit', 'update:fields']);

	const { collection, tableHeaders } = toRefs(props);
	const tableHeadersWritable = useSync(props, 'tableHeaders', emit);
	const selectionWritable = useSync(props, 'selection', emit);
	console.log('<--------------- JK Layout --------------->');
	console.log({tableHeaders});
	console.log(tableHeaders.value);
	const { useCollectionsStore } = useStores();
	console.log(useStores());
	console.log(useCollectionsStore());
	// const { getFromAliasedItem } = useAliasFields(fieldsWritable, collection);
</script>
