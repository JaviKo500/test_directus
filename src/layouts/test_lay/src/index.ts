import { computed, ref, toRefs, watch } from 'vue';
import { defineLayout, useCollection, useItems, useStores, useSync } from '@directus/extensions-sdk';
import LayoutComponent from './layout.vue';
import { syncRefProperty } from './utils/sync-ref-property';
import { Field, Item } from '@directus/types';
// @ts-ignore
import { useRouter } from 'vue-router';

import { getDefaultDisplayForType } from './utils/get-default-display-for-type';
import { formatCollectionItemsCount } from './utils/format-collection-items-count';
export default defineLayout({
	id: 'test_lay',
	name: 'Test lay',
	icon: 'box',
	component: LayoutComponent,
	slots: {
		options: () => null,
		sidebar: () => null,
		actions: () => null,
	},
	setup(props, { emit }) {


		const selection = useSync(props, 'selection', emit);
		const layoutQuery: any = useSync(props, 'layoutQuery', emit);
		const layoutOptions: any = useSync(props, 'layoutOptions', emit);
		const router = useRouter();

		const {useFieldsStore} = useStores();
		const fieldsStore = useFieldsStore();
		const { collection, filter, filterUser, search } = toRefs(props);
		const { info, primaryKeyField, fields: fieldsInCollection, sortField } = useCollection(collection as any);
		const { sort, limit, page, fields } = useItemOptions();
		const query: any = {
			fields: fields,
			limit, 
			sort, 
			search, 
			filter, 
			page
		};
		const {
			items,
			loading,
			error,
			totalPages,
			itemCount,
			totalCount,
			changeManualSort,
			getItems,
			getItemCount,
			getTotalCount,
		} = useItems(collection as any, query);

		const {
			tableSort,
			tableHeaders,
			tableRowHeight,
			activeFields,
			tableSpacing,
		} = useTable();
		console.log('<--------------- JK Index --------------->');
		console.log(items);
		console.log({tableHeaders});
		const showingCount = computed(() => {
			const filtering = Boolean((itemCount.value || 0) < (totalCount.value || 0) && filterUser.value);
			return formatCollectionItemsCount(itemCount.value || 0, page.value, limit.value, filtering);
		});
		return { 
			items, 
			totalPages,
			page,
			loading, 
			error,
			tableHeaders, 
			primaryKeyField,
			onRowClick,
			itemCount,
			search,
			toPage,
			limit,
			showingCount,
			fields
		};
		
		function useItemOptions() {
			const page = syncRefProperty<any, any>(layoutQuery, 'page'  , 1);
			const limit = syncRefProperty<any, any>(layoutQuery, 'limit', 25);
			const defaultSort = computed(() => (primaryKeyField.value ? [primaryKeyField.value?.field] : []));
			const sort = syncRefProperty<any, any>(layoutQuery, 'sort', defaultSort);

			const fieldsDefaultValue = computed(() => {
				return fieldsInCollection.value
					.filter((field: Field) => !field.meta?.hidden)
					.slice(0, 4)
					.map(({ field }: Field) => field)
					.sort();
			});
			const fields = syncRefProperty<any, any>(layoutQuery, 'fields', fieldsDefaultValue);
			return { sort, limit, page, fields };
		}
		function useTable() {
			const tableSort = computed(() => {
				if (!sort.value?.[0]) {
					return null;
				} else if (sort.value?.[0].startsWith('-')) {
					return { by: sort.value[0].substring(1), desc: true };
				} else {
					return { by: sort.value[0], desc: false };
				}
			});

			const localWidths = ref<{ [field: string]: number }>({});

			watch(
				() => layoutOptions.value,
				() => {
					localWidths.value = {};
				}
			);

			// const saveWidthsToLayoutOptions = debounce(() => {
			// 	layoutOptions.value = Object.assign({}, layoutOptions.value, {
			// 		widths: localWidths.value,
			// 	});
			// }, 350);

			const activeFields = computed<(Field & { key: string })[]>({
				get() {
					if (!collection.value) return [];

					return fields.value
						.map((key: any) => ({ ...fieldsStore.getField(collection.value!, key), key }))
						.filter((f: any) => f && f.meta?.special?.includes('no-data') !== true) as (Field & { key: string })[];
				},
				set(val) {
					fields.value = val.map((field) => field.field);
				},
			});

			const tableHeaders = computed<any[]>({
				get() {
					return activeFields.value.map((field) => {
						const description: string | null = null;

						return {
							text: field.name,
							value: field.key,
							description,
							width: localWidths.value[field.key] || layoutOptions.value?.widths?.[field.key] || null,
							align: layoutOptions.value?.align?.[field.key] || 'left',
							field: {
								display: field.meta?.display || getDefaultDisplayForType(field.type),
								displayOptions: field.meta?.display_options,
								interface: field.meta?.interface,
								interfaceOptions: field.meta?.options,
								type: field.type,
								field: field.field,
								collection: field.collection,
							},
							sortable: ['json', 'alias', 'presentation', 'translations'].includes(field.type) === false,
						} as any;
					});
				},
				set(val) {
					const widths = {} as { [field: string]: number };

					val.forEach((header) => {
						if (header.width) {
							widths[header.value] = header.width;
						}
					});

					localWidths.value = widths;

					// saveWidthsToLayoutOptions();

					fields.value = val.map((header) => header.value);
				},
			});

			const tableSpacing = syncRefProperty<any, any>(layoutOptions, 'spacing', 'cozy');

			const tableRowHeight = computed<number>(() => {
				switch (tableSpacing.value) {
					case 'compact':
						return 32;
					case 'cozy':
					default:
						return 48;
					case 'comfortable':
						return 64;
				}
			});

			return {
				tableSort,
				tableHeaders,
				tableSpacing,
				tableRowHeight,
				activeFields,
			};
		}
		function onRowClick({ item, event }: { item: Item; event: PointerEvent }) {
			if (props.readonly === true || !primaryKeyField.value) return;

			const primaryKey = item[primaryKeyField.value.field];

			if (props.selectMode || selection.value?.length > 0) {
				if (selection.value?.includes(primaryKey) === false) {
					selection.value = selection.value.concat(primaryKey);
				} else {
					selection.value = selection.value.filter((item) => item !== primaryKey);
				}
			} else {
				const next = router.resolve(`/content/${collection.value}/${encodeURIComponent(primaryKey)}`);

				if (event.ctrlKey || event.metaKey) window.open(next.href, '_blank');
				else router.push(next);
			}
		}
		function toPage(newPage: number) {
			page.value = newPage;
		}
	}
});
