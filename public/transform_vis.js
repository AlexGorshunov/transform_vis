import './transform_vis.less';

import { uiModules } from 'ui/modules';
import { VisController } from './vis_controller';
import { CATEGORY } from 'ui/vis/vis_category';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { VisSchemasProvider } from 'ui/vis/editors/default/schemas';
import { createRequestHandler } from './request_handler';

import optionsTemplate from './options_template.html';
import 'plugins/transform_vis/editor_controller';

function TransformVisProvider(Private, es, indexPatterns, $sanitize) {
  const VisFactory = Private(VisFactoryProvider);

  return VisFactory.createBaseVisualization({
    name: 'transform',
    title: 'Transform',
    description: 'Transfom query results to custom HTML using template language',
    icon: 'fa-exchange',
    category: CATEGORY.OTHER,
    visualization: VisController,
    visConfig: {
      defaults: {
        meta: `({
  count_hits: function() {
    return this.response.logstash_query.hits.total;
  }
})`,
        multiquerydsl: `{
  "logstash_query": {
    "index": "logstash-*",
    "query": {
      "bool": {
        "must": [
          "_DASHBOARD_CONTEXT_",
          "_TIME_RANGE_[@timestamp]"
        ]
      }
    }
  }
}`,
        formula: '<hr>{{response.logstash_query.hits.total}} total hits<hr>',
      },
    },
    editorConfig: {
      optionsTemplate: optionsTemplate,
    },
    requestHandler: createRequestHandler(Private, es, indexPatterns, $sanitize),
    responseHandler: 'none',
    options: {
      showIndexSelection: false,
    },
  });
}

VisTypesRegistryProvider.register(TransformVisProvider);
