"use client";

import {
  createTagAction,
  updateTagAction,
  deleteTagAction,
} from "@/app/(server)/actions/cms/content";
import { TaxonomyManager, type TaxonomyItem } from "../../../_components/taxonomy-manager";

export function TagsManager({ tags }: { tags: Array<Record<string, unknown>> }) {
  const items = tags as unknown as TaxonomyItem[];

  return (
    <TaxonomyManager
      kind="tag"
      title="Tagovi"
      description="Dodajte i organizujte tagove za blog objave."
      items={items}
      createItem={(data) => createTagAction({ name: data.name, slug: data.slug })}
      updateItem={(id, data) => updateTagAction(id, { name: data.name, slug: data.slug })}
      deleteItem={deleteTagAction}
    />
  );
}
