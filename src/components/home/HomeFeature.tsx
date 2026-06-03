import DefaultFeature, { type FeatureProps } from './DefaultFeature'

/**
 * Picks the home presentation for the featured release. Each release can have a
 * bespoke home — add an early return for its slug; everything else falls back to
 * DefaultFeature. The Home route only renders <HomeFeature/>, so adding or
 * swapping a presentation never touches the route, and past presentations stay in
 * the tree (re-feature a release and its home comes back).
 */
export default function HomeFeature({ release, locale }: FeatureProps) {
  // Bespoke homes go here, e.g.:
  // if (release.slug === 'el-increible-viaje-de-paquita')
  //   return <PaquitaFeature release={release} locale={locale} />
  return <DefaultFeature release={release} locale={locale} />
}
