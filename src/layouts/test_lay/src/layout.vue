import { toRefs } from 'vue';
<template>
	<div class="layout-tabular">
		<v-table
			ref="table"
			class="table"
			show-resize
			must-sort
			:items="items"
			selection-use-keys
		>
			<!-- <template v-for="header in tableHeaders" :key="header.value" #[`item.${header.value}`]="{ item }">
				<render-display
					:value="getFromAliasedItem(item, header.value)"
					:display="header.field.display"
					:options="header.field.displayOptions"
					:interface="header.field.interface"
					:interface-options="header.field.interfaceOptions"
					:type="header.field.type"
					:collection="header.field.collection"
					:field="header.field.field"
				/>
			</template> -->

		</v-table>
	</div>
</template>

<script setup lang="ts">
	import { toRefs } from 'vue';
	import { Item } from '@directus/types';
import { useCollection, useStores } from '@directus/extensions-sdk';

	interface Props {
		collection: string;
		items: Item[];
		tableHeaders: any[];
	}

	const props = withDefaults(defineProps<Props>(), {});

	const { collection } = toRefs(props);

	console.log('<--------------- JK Layout --------------->');
	const { useCollectionsStore } = useStores();
	console.log(useStores());
	console.log(useCollectionsStore());
	// const { getFromAliasedItem } = useAliasFields(fieldsWritable, collection);
</script>
