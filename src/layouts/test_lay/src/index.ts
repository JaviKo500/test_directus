import { computed, ref, toRefs } from 'vue';
import { defineLayout, useCollection, useItems, useSync } from '@directus/extensions-sdk';
import LayoutComponent from './layout.vue';
import { syncRefProperty } from './utils/sync-ref-property';
import { Field } from '@directus/types';

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
		const layoutQuery: any = useSync(props, 'layoutQuery', emit);
		const { collection, filter, filterUser, search } = toRefs(props);
		const { info, primaryKeyField, fields: fieldsInCollection, sortField } = useCollection(collection as any);
		const { sort, limit, page, fields } = useItemOptions();
		console.log({ sort, limit, page, fields });
		
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
		console.log('<--------------- JK Index --------------->');
		console.log(items);
		return { items };
		
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
	},
});
