<template>
	<div class="layout-tabular">
		<v-table
			v-if="loading || (itemCount && itemCount > 0 && !error)"
		  	:showResize="true"
			ref="table"
			class="table"
			fixed-header
			:show-select="showSelect ? showSelect : selection !== undefined"
			v-model="selectionWritable"
			:headers="tableHeadersWritable"
			:loading="loading"
			:items="items"
			@click:row="onRowClick"
			:item-key="primaryKeyField?.field"
			allow-header-reorder
			selection-use-keys
		  >

		  <template #footer>
				<div class="footer">
					<div class="pagination">
						<v-pagination
							v-if="totalPages > 1"
							:length="totalPages"
							:total-visible="7"
							show-first-last
							:model-value="page"
							@update:model-value="toPage"
						/>
					</div>

					<div v-if="loading === false && (items.length >= 25 || limit < 25)" class="per-page">
						<span>{{ t('per_page') }}</span>
						<v-select
							:model-value="`${limit}`"
							:items="pageSizes"
							inline
							@update:model-value="limitWritable = +$event"
						/>
					</div>
				</div>
			</template>
		</v-table>
		<slot v-else-if="itemCount === 0 && (filterUser || search)" name="no-items" />
		<slot v-else-if="itemCount === 0" name="no-items" />

	</div>
</template>
<script lang="ts">
export default {
	inheritAttrs: false,
};
</script>
<script setup lang="ts">
	import { ComponentPublicInstance, ref, toRefs } from 'vue';
	import { Item, ShowSelect, Field, Filter } from '@directus/types';
	import { useCollection, useStores, useSync } from '@directus/extensions-sdk';
	import { usePageSize } from './composables/use-page-size';
	// @ts-ignore
	import { useI18n } from 'vue-i18n';
	interface Props {
		collection: string;
		items: Item[];
		selection?: Item[];
		tableHeaders: any;
		showSelect?: ShowSelect;
		loading: boolean,
		error?: any;
		readonly: boolean;
		primaryKeyField?: Field;
		onRowClick: (item: Item) => void;
		itemCount?: number;
		filterUser?: Filter;
		search?: string;
		totalPages: number;
		page: number;
		toPage: (newPage: number) => void;
		limit: number;
	}

	const props = withDefaults(defineProps<Props>(), {
		selection: () => [],
		showSelect: 'none',
		itemCount: undefined,
		filterUser: undefined,
		search: undefined,
	});
	const emit = defineEmits(['update:selection', 'update:tableHeaders', 'update:limit', 'update:fields']);
	
	const { t } = useI18n();
	const { collection, tableHeaders } = toRefs(props);
	const tableHeadersWritable = useSync(props, 'tableHeaders', emit);
	const selectionWritable = useSync(props, 'selection', emit);
	const limitWritable: any = useSync(props, 'limit', emit);


	const { sizes: pageSizes, selected: selectedSize } = usePageSize<string>(
		[25, 50, 100, 250, 500, 1000],
		(value) => String(value),
		props.limit
	);
	limitWritable.value = selectedSize;
	console.log('<--------------- JK Layout --------------->');
</script>
