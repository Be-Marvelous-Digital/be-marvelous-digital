import type { NextConfig } from 'next';
import path from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

const lessLoaderOptions = {
  lessOptions: {
    paths: [path.resolve(process.cwd(), 'src/styles')],
    javascriptEnabled: true,
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
    rules: {
      '*.less': {
        loaders: [
          {
            loader: 'less-loader',
            options: lessLoaderOptions,
          },
        ],
        as: '*.css',
      },
    },
  },
  // Extend webpack to support .less files (CSS Modules + global)
  webpack(config, { dev, isServer }) {
    // Find the oneOf rule block where Next.js registers CSS rules
    const rules = config.module.rules as any[];
    const ruleWithOneOf = rules.find(
      (r) => typeof r === 'object' && r !== null && Array.isArray(r.oneOf),
    );

    if (ruleWithOneOf) {
      const clonedLessRules: any[] = [];

      ruleWithOneOf.oneOf.forEach((rule: any) => {
        if (!rule.test) return;

        const testStr = rule.test.toString();
        // Only clone CSS rules (both module and global)
        if (!testStr.includes('\\.css')) return;

        // Build the LESS version of this rule
        const lessRule = { ...rule };

        // Swap the test: .css → .less
        try {
          lessRule.test = new RegExp(
            rule.test.source.replace('\\.css', '\\.less'),
            rule.test.flags,
          );
        } catch {
          return; // skip rules whose regex can't be adapted
        }

        // Add less-loader at the END of the use chain (runs first in webpack)
        if (Array.isArray(rule.use)) {
          lessRule.use = [
            ...rule.use,
            {
              loader: require.resolve('less-loader'),
              options: lessLoaderOptions,
            },
          ];
        } else if (rule.use) {
          lessRule.use = [
            rule.use,
            {
              loader: require.resolve('less-loader'),
              options: lessLoaderOptions,
            },
          ];
        }

        clonedLessRules.push(lessRule);
      });

      // Append the LESS rules into the same oneOf block
      ruleWithOneOf.oneOf.push(...clonedLessRules);
    }

    return config;
  },

  output: 'standalone',

  images: {
    remotePatterns: [
      // Allow external images if needed for portfolio screenshots in future
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
